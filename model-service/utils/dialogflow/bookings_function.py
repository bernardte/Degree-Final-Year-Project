from fastapi.responses import JSONResponse
from config.mongoDB import db

# 用于 Dialogflow 的 track_booking webhook
async def track_booking(parameters: dict):
    bookingId = parameters.get("bookingId")

    if not bookingId:
        # 如果用户没提供 ID，要求他们提供
        return JSONResponse(content={
            "fulfillmentText": "Could you please provide your booking ID so I can check the status?"
        })

    # 从数据库查找预订记录，只取状态字段
    result = await db["bookings"].find_one(
        {"bookingReference": bookingId},
        {"_id": 0, "status": 1}
    )

    if result:
        # 找到预订
        status = result.get("status", "unknown")
        return JSONResponse(content={
            "fulfillmentText": f"Your booking (ID: {bookingId}) is currently {status}."
        })
    else:
        # 没找到该预订
        return JSONResponse(content={
            "fulfillmentText": f"Sorry, I couldn’t find a booking with ID {bookingId}. Please check the ID and try again."
        })
