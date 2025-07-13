from fastapi import FastAPI, HTTPException #Throw http error
from fastapi.responses import JSONResponse #customize json response
from pydantic import BaseModel #to check resquest body data
from contextlib import asynccontextmanager #用于生命周期管理
import uuid

# ── own modules ───────────────────────────────────────────
from config.mongoDB import db, mongo_client
from faq_search import find_best_faq, load_faqs_from_mongodb
from llm import ask_llm
# ───────────────────────────────────────────────────────────────

from anyio import to_thread

@asynccontextmanager
async def lifespan(app: FastAPI):
    
    """Populate vector store once, when the service boots."""
    print("[INIT] Initializing FAQ vector store …")
    # load_faqs_from_mongodb is sync; run in threadpool so it
    # doesn’t block the event loop.
    await to_thread.run_sync(load_faqs_from_mongodb, db) #Because loading function is synchronous and will block the main thread, it is put into the thread pool for execution.
    yield #yield pauses the function's execution and returns a value to the caller
    mongo_client.close()
    print("[SHUTDOWN] MongoDB connection closed.")

app = FastAPI(title="Hotel RAG Chatbot", lifespan=lifespan)
# ---------- Pydantic model to validate incoming JSON ---------- #
class RagRequest(BaseModel):
    question: str
    conversationId: str
    context: list[dict] = []

# ---------------------------- Route --------------------------- #
@app.post("/rag-reply")
async def rag_reply(payload: RagRequest):
    # 1. Vector search (sync) –> offload to thread to stay non‑blocking
    score, faq = await to_thread.run_sync(find_best_faq, payload.question)

    print(f"best score: {score}")
    print(f"best answer: {faq}")

    # 2. If no good FAQ hit → handover
    if not faq.get("question") or not faq.get("answer") or score < 0.5:
        return JSONResponse(
            status_code=200,
            content={
                "reply": "I'm not sure about your question. I'll transfer you to human customer service.",
                "suggestions": [],
                "handover": True,
            },
        )

    # 3. Prepare prompt for LLM
    # The last 5 conversations are stitched together into a conversation history for reference by the large model.
    history = "\n".join(
        f"{m['role']}: {m['content']}" for m in payload.context[-5:]
    )

    prompt = f"""
You are the hotel's intelligent customer service. The following is the user's conversation record and related FAQ:
history conversation:
{history}

relevant FAQ:
Question: {faq['question']}
Answer: {faq['answer']}

Users are now asking: {payload.question}
Please answer in concise and polite language, based on the FAQ and context.
"""

    # 4. LLM call (sync?) – offload if blocking
    reply = await to_thread.run_sync(ask_llm, prompt)
    req_id = uuid.uuid4()

    print(f"[{req_id}] prompt:\n{prompt}")
    print(f"[{req_id}] reply: {reply}")

    # 5. Respond
    return {
        "reply": reply.strip(),
        "suggestions": [
            "I want to change order",
            "search booking status",
            "cancelled order",
        ],
        "handover": False,
    }

# ---------------- Running locally ----------------------------- #
# Save this file as app.py, then:
#   uvicorn app:app --host 0.0.0.0 --port 5001 --reload
#
# • uvicorn is an ASGI server, giving you real async throughput.
# • --reload auto‑restarts on code changes (dev‑only).
