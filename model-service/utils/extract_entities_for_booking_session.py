from constants.FSM_constant import FSM
import json
from datetime import datetime
from typing import Dict
from .entity_extractor import extract_entities_booking_session
from .bookings import add_booking
from models.llm import stream_llm
from config.redis import redis_client

async def extract_entities_for_booking_session(user_input: str, userType: str, conversationId: str, senderId: str):
    entities = extract_entities_booking_session(user_input=user_input, userType=userType)
    print(f"entities: {entities}")
    if entities and any(entities.values()):
        # Sanitize values before saving to Redis
        clean_entities = {}
        for key, value in entities.items():
            if isinstance(value, list):
                clean_entities[key] = json.dumps(value)
            elif value is None:
                clean_entities[key] = ""
            else:
                clean_entities[key] = str(value)

            if key in ["checkInDate", "checkOutDate"] and value and isinstance(value, str):
                clean_entities[key] = normalize_date(value)
        await redis_client.hset(f"{conversationId}:entities", mapping=clean_entities) #type: ignore
        print(f"[DEBUG] Saved to Redis: {clean_entities}")
    steps = FSM.get("booking", [])

    

    saved_entities: Dict[str, str] = await redis_client.hgetall(f"{conversationId}:entities") # type: ignore
    print(f"[DEBUG] Loaded from Redis: {saved_entities}")
    if "roomTypes" in saved_entities and saved_entities["roomTypes"]:
        saved_entities["roomTypes"] = json.loads(saved_entities["roomTypes"])
    # 检查必填字段
    required_fields = ["checkInDate", "checkOutDate", "roomTypes", "contactName", "contactEmail", "contactNumber"]
    missing = [f for f in required_fields if not saved_entities.get(f)]
                                                                                
    if not missing:
        # 数据齐全 -> 直接创建 booking
        checkInDate = datetime.fromisoformat(saved_entities["checkInDate"])
        checkOutDate = datetime.fromisoformat(saved_entities["checkOutDate"])
        roomTypes = json.loads(saved_entities["roomTypes"]) if isinstance(saved_entities["roomTypes"], str) and saved_entities["roomTypes"].startswith("[") else [saved_entities["roomTypes"]]
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
      
def normalize_date(date_str: str) -> str:
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y", "%m/%d/%Y"):
        try:
             return datetime.strptime(date_str, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue

    return date_str 