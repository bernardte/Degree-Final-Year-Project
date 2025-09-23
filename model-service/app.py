from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from contextlib import asynccontextmanager #For lifecycle management
import json
import uvicorn
from fastapi import Query

# ── own modules ───────────────────────────────────────────
from config.mongoDB import db, mongo_client
from retrieval import load_faqs_from_mongodb
from classes.interface import RagRequest
from classes.interface import BookingSession
from classes.interface import BookingList
from controllers.chatbot_controller import handle_chatbot
from controllers.anomaly_detection_controller import anomaly_detection_booking_session, anomaly_detection_booking
from models import stream_llm
from utils import chunkedStream

# ───────────────────────────────────────────────────────────────

from anyio import to_thread
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Populate vector store once, when the service boots."""
    print("[INIT] Initializing FAQ vector store …")
    # load_faqs_from_mongodb is sync; run in threadpool so it
    # doesn’t block the event loop.
    await load_faqs_from_mongodb(db) #Because loading function is synchronous and will block the main thread, it is put into the thread pool for execution.
    yield #yield pauses the function's execution and returns a value to the caller
    mongo_client.close()
    print("[SHUTDOWN] MongoDB connection closed.")

app = FastAPI(title="Smart FAQ Chatbot", lifespan=lifespan)

# ---------------------------- Route --------------------------- #
# @app.post("/bot-reply")
# async def rag_reply(payload: RagRequest):
#     print(f"new request: {payload}")
#     return await handle_chatbot(payload)

@app.websocket("/bot-reply-ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            payload = await ws.receive_json()  # received a dictionaries
            print(f"payload: {payload}")
            conversation_id = payload.get("conversationId")
            question = payload.get("question")
            context = payload.get("context", "")
            senderId = payload.get("senderId")
            senderType = payload.get("senderType")

            if not question or not conversation_id:
                await ws.send_json({"error": "question and conversationId Required"})
                continue

            # Let handle_chatbot generate streaming responses
            async for token, is_final in handle_chatbot(payload):
                print(f"token: {token}, {is_final}")
                await ws.send_json({
                    "conversationId": conversation_id,
                    "token": token,
                    "isFinal": is_final
                })
    except WebSocketDisconnect:
        print("customer sider disconnect")

@app.post("/predict")
def predict_booking_session_anomaly(session: BookingSession):
    print(f"your session: {session}")
    prediction, score = anomaly_detection_booking_session(session=session)

    return {
        "anomaly": bool(prediction == -1),
        "raw_prediction": int(prediction),
        "score": float(score),
        "result": "abnormal" if prediction == -1 else "normal",
    }

@app.post("/predict-booking-anomaly")
async def predict_booking_anomaly():
    result = await anomaly_detection_booking()
    print(f"anomaly booking result: {result}")
    return result
# ---------------- Running locally ----------------------------- #
# Save this file as app.py, then:
#   uvicorn app:app --host 0.0.0.0 --port 5001 --reload
#
# • uvicorn is an ASGI server, giving you real async throughput.
# • --reload auto‑restarts on code changes (dev‑only).
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5001)