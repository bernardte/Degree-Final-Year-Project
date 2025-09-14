from config.mongoDB import db
import uuid
from datetime import datetime
from typing import List, Tuple, Optional, Dict, Any

bookingSession_collection = db["bookingsessions"]
room_collection = db["rooms"]
bookings_collection = db["bookings"]

async def add_booking(
    senderId: str,
    senderType: str,
    checkInDate: datetime,
    checkOutDate: datetime,
    roomTypes: List[str],
    contactName: str = "",
    contactEmail: str = "",
    contactNumber: str = ""
) -> Tuple[Optional[str], Optional[str]]:
    """
    Create a new booking session if no overlap exists.
    Returns (confirm_link, error_message).
    """

    #  确保 roomTypes 是一维字符串数组
    flat_room_types: List[str] = []
    for rt in roomTypes:
        if isinstance(rt, list):
            flat_room_types.extend(rt)
        else:
            flat_room_types.append(rt)
    roomTypes = [r.lower().strip() for r in flat_room_types]

    # 查询房型
    cursor = room_collection.find({"roomType": {"$in": roomTypes}})
    rooms = await cursor.to_list(length=None)

    if not rooms:
        return None, f"Sorry, no room found for type(s): {roomTypes}"

    roomIds = [str(room["_id"]) for room in rooms]

    # 检查冲突：入住 < 已预订的结束时间 且 离开 > 已预订的开始时间
    conflict = await bookings_collection.find_one({
        "roomId": {"$in": roomIds},
        "startDate": {"$lt": checkOutDate},
        "endDate": {"$gt": checkInDate}
    })

    if conflict:
        return None, "Sorry, this room is not available for the selected dates."

    # 客人详情
    guestDetails: Optional[Dict[str, Any]] = None
    if senderType == "guest":
        guestDetails = {
            "contactName": contactName,
            "contactEmail": contactEmail,
            "contactNumber": contactNumber
        }

    # 创建 session
    session_id = str(uuid.uuid4())
    booking_session = {
        "sessionId": session_id,
        "userId": senderId if senderType == "user" else None,
        "guestId": senderId if senderType == "guest" else None,
        "guestDetails": guestDetails,
        "roomIds": roomIds,  # ✅ 改为复数，避免混淆
        "checkInDate": checkInDate.isoformat(),
        "checkOutDate": checkOutDate.isoformat(),
        "paymentStatus": "pending",
        "createdAt": datetime.utcnow().isoformat()
    }

    await bookingSession_collection.insert_one(booking_session)  # type: ignore

    confirm_link = f"http://localhost:3000/booking/confirm/{session_id}"
    return confirm_link, None
