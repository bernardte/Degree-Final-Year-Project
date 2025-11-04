from constants.FSM_constant import FSM
import json
from datetime import datetime
from typing import Dict
from .bookings import add_booking
from config.redis import redis_client
import spacy
import re

# ------------------ 初始化 SpaCy ------------------ #
nlp = spacy.load("en_core_web_sm")

from spacy.pipeline import EntityRuler
ruler = nlp.add_pipe("entity_ruler", before="ner")

# 自定义房型实体模式
patterns = [
    {"label": "ROOM_TYPE", "pattern": "deluxe room"},
    {"label": "ROOM_TYPE", "pattern": "standard room"},
    {"label": "ROOM_TYPE", "pattern": "family suite"},
    {"label": "ROOM_TYPE", "pattern": "honeymoon suite"},
    {"label": "ROOM_TYPE", "pattern": "single room"},
    {"label": "ROOM_TYPE", "pattern": "double room"},
    {"label": "ROOM_TYPE", "pattern": "twin room"},
    {"label": "ROOM_TYPE", "pattern": "executive suite"},
    {"label": "ROOM_TYPE", "pattern": "presidential suite"},
]
ruler.add_patterns(patterns) #type: ignore

# ------------------ 实体抽取函数 ------------------ #
async def extract_entities_for_booking_session(user_input: str, userType: str, conversationId: str, senderId: str):
    """
    从用户输入中提取实体，并在信息齐全时调用 add_booking()
    """
    # 首先从Redis获取所有步骤实体
    step_entities: Dict[str, str] = await redis_client.hgetall(f"{conversationId}:entities") or {}
    print(f"[DEBUG] Old entities from Redis: {step_entities}")

    # 从当前输入提取实体
    doc = nlp(user_input)
    current_entities = {
        "checkInDate": None,
        "checkOutDate": None,
        "roomTypes": [],
        "contactName": None,
        "contactEmail": None,
        "contactNumber": None,
    }

    # 使用 SpaCy 的 NER 从当前输入提取
    for ent in doc.ents:
        if ent.label_ == "DATE":
            date_value = normalize_date(ent.text)
            if not current_entities["checkInDate"]:
                current_entities["checkInDate"] = date_value
            elif not current_entities["checkOutDate"] and date_value != current_entities["checkInDate"]:
                current_entities["checkOutDate"] = date_value

        elif ent.label_ == "PERSON":
            current_entities["contactName"] = ent.text

        elif ent.label_ == "EMAIL":
            current_entities["contactEmail"] = ent.text

        elif ent.label_ == "PHONE" or re.match(r"\+?\d{7,}", ent.text):
            current_entities["contactNumber"] = ent.text

        elif ent.label_ == "ROOM_TYPE":
            if ent.text not in current_entities["roomTypes"]:
                current_entities["roomTypes"].append(ent.text)

    # 额外的正则表达式提取
    current_entities.update(extract_with_regex(user_input))
    print(f"[SPACY ENTITIES - CURRENT INPUT] {current_entities}")

    # 关键修复：映射步骤实体到预订实体
    merged_entities = await map_step_entities_to_booking_entities(step_entities, current_entities)
    
    # 保存合并后的实体到Redis
    clean_entities = {}
    for key, value in merged_entities.items():
        if isinstance(value, list):
            clean_entities[key] = json.dumps(value)
        elif value is None:
            clean_entities[key] = ""
        else:
            clean_entities[key] = str(value)

    # 只保存非空值
    final_entities = {}
    for key, value in clean_entities.items():
        if value and value != "[]" and value != '""':  # 只保存有值的实体
            final_entities[key] = value

    if final_entities:
        await redis_client.hset(f"{conversationId}:entities", mapping=final_entities)
    
    print(f"[DEBUG] Saved merged entities to Redis: {final_entities}")

    # 从 Redis 获取所有保存的实体进行验证
    saved_entities: Dict[str, str] = await redis_client.hgetall(f"{conversationId}:entities")
    print(f"[DEBUG] Final merged entities from Redis: {saved_entities}")

    # 处理 roomTypes 数据
    if "roomTypes" in saved_entities and saved_entities["roomTypes"]:
        try:
            roomTypes_data = json.loads(saved_entities["roomTypes"])
            if isinstance(roomTypes_data, list):
                saved_entities["roomTypes"] = roomTypes_data
            else:
                saved_entities["roomTypes"] = [roomTypes_data]
        except json.JSONDecodeError:
            saved_entities["roomTypes"] = [saved_entities["roomTypes"]]
    else:
        saved_entities["roomTypes"] = []

    # 检查必填字段
    required_fields = ["checkInDate", "checkOutDate", "roomTypes", "contactName", "contactEmail", "contactNumber"]
    
    # 检查每个必填字段是否有值
    missing = []
    for field in required_fields:
        field_value = saved_entities.get(field)
        if not field_value or (isinstance(field_value, list) and len(field_value) == 0):
            missing.append(field)

    print(f"[BOOKING] Missing fields: {missing}")

    # 如果信息齐全，创建预订
    if not missing:
        try:
            checkInDate = datetime.fromisoformat(saved_entities["checkInDate"])
            checkOutDate = datetime.fromisoformat(saved_entities["checkOutDate"])
            roomTypes = saved_entities["roomTypes"]
            contactName = saved_entities["contactName"]
            contactEmail = saved_entities["contactEmail"]
            contactNumber = saved_entities["contactNumber"]

            confirm_link, error = await add_booking(
                senderId=senderId,
                senderType=userType,
                checkInDate=checkInDate,
                checkOutDate=checkOutDate,
                roomTypes=roomTypes,
                contactName=contactName,
                contactEmail=contactEmail,
                contactNumber=contactNumber
            )

            return confirm_link, error
            
        except Exception as e:
            return None, f"Error processing booking: {str(e)}"
    
    return None, f"Missing required information: {', '.join(missing)}"


async def map_step_entities_to_booking_entities(step_entities: Dict[str, str], current_entities: Dict) -> Dict:
    """
    将步骤实体映射到预订实体
    """
    mapping = {
        "ask_check_in_date": "checkInDate",
        "ask_check_out_date": "checkOutDate", 
        "ask_room_type": "roomTypes",
        "ask_contact_name": "contactName",
        "ask_contact_email": "contactEmail",
        "ask_contact_number": "contactNumber"
    }
    
    merged_entities = current_entities.copy()
    
    # 映射步骤实体
    for step_key, booking_key in mapping.items():
        if step_key in step_entities and step_entities[step_key]:
            step_value = step_entities[step_key]
            
            # 如果当前实体中没有该字段或为空，使用步骤实体中的值
            if not merged_entities.get(booking_key):
                if booking_key == "roomTypes":
                    # 处理房型列表
                    if step_value and step_value not in merged_entities[booking_key]:
                        merged_entities[booking_key].append(step_value)
                else:
                    # 处理其他字段
                    merged_entities[booking_key] = step_value
                    
                    # 特殊处理：日期字段需要标准化
                    if booking_key in ["checkInDate", "checkOutDate"]:
                        normalized_date = normalize_date(step_value)
                        if normalized_date:
                            merged_entities[booking_key] = normalized_date
    
    # 特殊处理：确保日期格式正确
    for date_field in ["checkInDate", "checkOutDate"]:
        if merged_entities.get(date_field) and isinstance(merged_entities[date_field], str):
            normalized = normalize_date(merged_entities[date_field])
            if normalized:
                merged_entities[date_field] = normalized
    
    print(f"[DEBUG] After mapping - Merged entities: {merged_entities}")
    return merged_entities


def extract_with_regex(text: str) -> Dict[str, str]:
    """使用正则表达式补充提取实体"""
    entities = {}
    
    # 邮箱提取
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    email_match = re.search(email_pattern, text)
    if email_match:
        entities["contactEmail"] = email_match.group()
    
    # 电话号码提取
    phone_pattern = r'(\+?(\d{1,3})?[\s-]?)?(\(?\d{3}\)?[\s-]?\d{3,4}[\s-]?\d{3,4})'
    phone_match = re.search(phone_pattern, text)
    if phone_match:
        entities["contactNumber"] = phone_match.group()
    
    return entities


# ------------------ 日期格式标准化 ------------------ #
def normalize_date(date_str: str) -> str:
    """
    将日期字符串转换为标准 ISO 格式 (YYYY-MM-DD)
    """
    if not date_str or date_str.strip() == "":
        return ""
        
    # 处理常见日期格式
    formats = [
        "%Y-%m-%d", 
        "%d/%m/%Y", 
        "%d-%m-%Y", 
        "%m/%d/%Y",
        "%d %B %Y",
        "%B %d, %Y",
        "%d %b %Y",
        "%b %d, %Y"
    ]
    
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue

    # 如果没匹配成功，尝试正则找日期
    match = re.search(r"(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})", date_str)
    if match:
        d, m, y = match.groups()
        if len(y) == 2:
            y = f"20{y}"
        return f"{y}-{int(m):02d}-{int(d):02d}"

    # 处理月份名称
    month_mapping = {
        'january': '01', 'february': '02', 'march': '03', 'april': '04',
        'may': '05', 'june': '06', 'july': '07', 'august': '08',
        'september': '09', 'october': '10', 'november': '11', 'december': '12',
        'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
        'jun': '06', 'jul': '07', 'aug': '08', 'sep': '09',
        'oct': '10', 'nov': '11', 'dec': '12'
    }
    
    for month_name, month_num in month_mapping.items():
        if month_name in date_str.lower():
            # 简单提取 - 实际应用可能需要更复杂的逻辑
            year_match = re.search(r'20\d{2}', date_str)
            year = year_match.group() if year_match else "2024"
            day_match = re.search(r'\b(\d{1,2})\b', date_str)
            day = day_match.group(1) if day_match else "01"
            return f"{year}-{month_num}-{int(day):02d}"

    return date_str  # 如果无法解析，返回原字符串