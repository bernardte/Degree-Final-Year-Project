from pydantic import BaseModel #to check resquest body data

# ---------- Pydantic model to validate incoming JSON ---------- #
class RagRequest(BaseModel):
    question: str
    conversationId: str
    context: list[dict] = []
