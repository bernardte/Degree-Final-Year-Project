import re
import json
import subprocess
from typing import Dict, Optional, Any
from datetime import datetime
from dateutil import parser

def regex_extract(user_input: str) -> Dict[str, Optional[str]]:
    result: Dict[str, Optional[str]] = {"bookingReference": "", "email": "", "name": ""}

    # booking reference (UUID v4 格式，允许出现在句子中)
    ref_match = re.search(
        r"\b[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b",
        user_input,
        re.IGNORECASE,
    )
    if ref_match:
        result["bookingReference"] = ref_match.group() 

    # email
    email_match = re.search(
        r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+",
        user_input,
    )
    if email_match:
        result["email"] = email_match.group()

    return result



def llm_extract(user_input: str) -> Dict[str, Optional[str]]:
    prompt = f"""
You are an information extractor. 
Extract the bookingReference (UUID v4), name (if any), and email from the user's text.  
If a field is not found, set it to null.  
Output JSON only, no extra text.

User: {user_input}
"""

    try:
        result = subprocess.run(
            ["ollama", "run", "mistral"],
            input=prompt.encode("utf-8"),
            capture_output=True,
            timeout=30
        )
        output = result.stdout.decode("utf-8").strip()

        # 防止 LLM 输出多余解释
        json_start = output.find("{")
        json_end = output.rfind("}")
        if json_start != -1 and json_end != -1:
            output = output[json_start:json_end+1]

        return json.loads(output)

    except Exception as e:
        print("LLM extract failed:", e)
        return {"bookingReference": "", "name": "", "email": ""}


def extract_entities(user_input: str):
    entities = regex_extract(user_input)

    # If there are missing fields, use LLM as a fallback
    if not all(entities.values()):
        llm_entities = llm_extract(user_input)
        for k, v in llm_entities.items():
            if not entities.get(k) and v:
                entities[k] = v

    return entities

def regex_extract_booking_session(user_input: str, userType: str) -> Dict[str, Any]:
    result: Dict[str, Any] = {
        "checkInDate": None,
        "checkOutDate": None,
        "roomTypes": [],
        "contactName": "",
        "contactEmail": "",
        "contactNumber": "",
    }

    # email
    if userType == "guest":
        email_match = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", user_input)
        if email_match:
            result["contactEmail"] = email_match.group()

        # phone number
        phone_match = re.search(r"(?:\+?\d{1,3}[- ]?)?\d{7,12}", user_input)
        if phone_match:
            result["contactNumber"] = phone_match.group()

    # Date (supports 2025-09-15 or 15/09/2025)
    date_matches = re.findall(r"(\d{4}-\d{2}-\d{2}|\d{2}/\d{2}/\d{4})", user_input)
    if date_matches:
        result["checkInDate"] = parser.parse(date_matches[0], dayfirst=True).date()
        if len(date_matches) > 1:
            result["checkOutDate"] = parser.parse(date_matches[1], dayfirst=True).date()
    else:
        # Try fuzzy parse (handles "12 Aug 2025", "tomorrow", etc.)
        try:
            parsed_date = parser.parse(user_input, fuzzy=True)
            result["checkInDate"] = parsed_date.date()
        except:
            pass

    # roomTypes
    room_matches = re.findall(r"\b(deluxe|suite|standard|single|double)\b", user_input, re.IGNORECASE)
    if room_matches:
        result["roomTypes"] = [r.lower() for r in room_matches]

    return result


def llm_extract_booking_session(user_input: str) -> Dict[str, Any]:
    prompt = f"""
You are an information extractor for hotel bookings.
Extract the following fields from the user input.

Output format:
```json
{{
  "checkInDate": "YYYY-MM-DD or null",
  "checkOutDate": "YYYY-MM-DD or null",
  "roomTypes": ["list of strings"],
  "contactName": "string or null",
  "contactEmail": "string or null",
  "contactNumber": "string or null"
}}

User: {user_input}
"""

    try:
        result = subprocess.run(
            ["ollama", "run", "mistral"],
            input=prompt.encode("utf-8"),
            capture_output=True,
            timeout=30
        )
        output = result.stdout.decode("utf-8").strip()

        # 提取 JSON 部分（防止 LLM 多说话）
        json_match = re.search(r"\{[\s\S]*\}", output)
        if not json_match:
            return {}

        clean_output = json_match.group(0)
        return json.loads(clean_output)

    except Exception as e:
        print("LLM extract failed:", e)
        return {}


async def extract_entities_booking_session(user_input: str, userType: str) -> Dict[str, Any]:
    # Step 1: regex first
    entities = regex_extract_booking_session(user_input=user_input, userType=userType)

    # Step 2: fallback to LLM if something missing
    if not all([entities["checkInDate"], entities["checkOutDate"], entities["roomTypes"]]):
        llm_entities = llm_extract_booking_session(user_input)
        for k, v in llm_entities.items():
            if not entities.get(k) and v:
                entities[k] = v

    # Step 3: Ensure roomTypes is always a flat list of strings
    clean_room_types = []
    for rt in entities.get("roomTypes", []):
        if isinstance(rt, list):
            clean_room_types.extend(rt)
        else:
            clean_room_types.append(rt)

    entities["roomTypes"] = [str(r).lower() for r in clean_room_types if r]

    return entities
