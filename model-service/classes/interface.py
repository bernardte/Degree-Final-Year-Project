from typing import List, Dict, Any
from pydantic import BaseModel, Field #to check request body data
from bson import ObjectId
# ---------- Pydantic model to validate incoming JSON ---------- #
class RagRequest(BaseModel):
    question: str
    conversationId: str
    context: list[dict] = []

class BookingSession(BaseModel):
    sessionId: str
    totalPrice: int
    adults: int
    children: int
    nights: int
    roomId: List[str] = Field(default_factory=list)
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class BookingInput(BaseModel):
    bookingReference: str
    userId: str
    bookingDate: str
    totalPrice: float
    refundAmount: float
    refundDiscount: float
    userType: str
    guestId: str = ""
    bookingCreatedByUser: str = ""
    totalGuests: Dict[str, Any]
    room: str
    paymentMethod: str
    status: str 

class BookingList(BaseModel):
    data: List[BookingInput]
    