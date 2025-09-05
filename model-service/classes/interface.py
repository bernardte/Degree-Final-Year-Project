from typing import List
from pydantic import BaseModel #to check resquest body data

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

