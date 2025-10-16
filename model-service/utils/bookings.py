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

    # validate room types
    flat_room_types: List[str] = []
    for rt in roomTypes:
        if isinstance(rt, list):
            flat_room_types.extend(rt)
        else:
            flat_room_types.append(rt)
    roomTypes = [r.lower().strip() for r in flat_room_types]

    # check if room type exists
    cursor = room_collection.find({"roomType": {"$in": roomTypes}})
    rooms = await cursor.to_list(length=None)

    if not rooms:
        return None, f"Sorry, no room found for type(s): {roomTypes}"

    roomIds = [str(room["_id"]) for room in rooms]

    # check for available slot (avoid double booking)
    conflict = await bookings_collection.find_one({
        "roomId": {"$in": roomIds},
        "startDate": {"$lt": checkOutDate},
        "endDate": {"$gt": checkInDate}
    })

    if conflict:
        return None, "Sorry, this room is not available for the selected dates."
    
    num_nights = (checkOutDate - checkInDate).days
    total_price = 0.0
    if num_nights <= 0:
        return None, "Check-out date must be after check-in date."

    #accumulate each room price
    for room in rooms:
        room_price = room.get("pricePerNight", 0)
        total_price += room_price * num_nights

    # guest user details 
    guestDetails: Optional[Dict[str, Any]] = None
    if senderType == "guest":
        guestDetails = {
            "contactName": contactName,
            "contactEmail": contactEmail,
            "contactNumber": contactNumber
        }

    # create booking session
    session_id = str(uuid.uuid4())
    booking_session = {
        "sessionId": session_id,
        "userId": senderId if senderType == "user" else None,
        "guestId": senderId if senderType == "guest" else None,
        "guestDetails": guestDetails,
        "roomId": roomIds, 
        "checkInDate": checkInDate,
        "checkOutDate": checkOutDate,
        "paymentStatus": "pending",
        "createdAt": datetime.utcnow()
    }

    await bookingSession_collection.insert_one(booking_session)  # type: ignore
    # http://localhost:3000/booking/confirm/da43d8b3-2a47-4e94-a011-f7dbbcb61a6c
    confirm_link = f"http://localhost:3000/booking/confirm/{session_id}"
    return confirm_link, None

async def get_all_room_types() -> List[str]:
    """
        Fetch all distinct room types from the rooms collection.
    """
    rooms_cursor = db["rooms"].find({},  {"roomType": 1, "_id": 0})
    room_list = [room async for room in rooms_cursor]
    room_types = [room["roomType"] for room in room_list]
    return room_types