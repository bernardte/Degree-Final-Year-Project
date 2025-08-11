from fastapi.responses import JSONResponse  #customize json response
import asyncio
# own modules
from config.redis import redis_client
from utils.intent_detector import detect_intent
from constants.FSM_constant import FSM, TEMPLATES, NO_SUGGESTION_INTENTS
from models import stream_llm
from retrieval import find_best_faq

async def handle_chatbot(payload):
    conversationId = payload.get("conversationId")
    question = payload.get("question")
    user_input = question.strip()
    context = payload.get("context", "")
    chat_context = context


    current_state = await redis_client.get(conversationId)
    step = 0
    if not current_state:
        intent = await detect_intent(user_input)
        await redis_client.set(conversationId, intent)
    else:
        if ":" in current_state:
            intent, step = current_state.split(":")
            step = int(step)
        else:
            intent = current_state
            step = 0

    # 检测是否切换意图
    new_intent = await detect_intent(user_input=user_input)
    if new_intent != intent:
        intent = new_intent
        step = 0
        await redis_client.set(conversationId, intent)

    # FSM 逻辑
    if intent in FSM:
        steps = FSM.get(intent, [])
        if not steps:
            prompt = f"You are a helpful assistant. The user said: '{user_input}'. Reply politely."
            async for token in stream_llm(prompt=prompt):
                yield token, False
            yield "", True
            return

        if step < len(steps):
            response_key = steps[step]
            response = TEMPLATES.get(response_key, f"{intent.capitalize()} {response_key.replace('-', ' ')}")
            await redis_client.set(conversationId, f"{intent}:{step + 1}")
            yield response, True
            return
        else:
            await redis_client.delete(conversationId)
            yield f"Your request to {intent.replace('_', ' ')} has been completed.", True
            return

    # FAQ 检索
    score, faq = await find_best_faq(query=user_input)
    if faq.get("answer") and score >= 0.5:
        history = "\n".join(
            f"{m['role']}: {m.get('content', '')}"
            for m in chat_context if "role" in m
        )

        prompt = f"""
You are a hotel assistant called Harold. Use the retrieved FAQ answer below to respond politely and make sure when receiving 'hi' keyword must include your name.

Relevant FAQ:
Q: {faq['question']}
A: {faq['answer']}

User Question: "{user_input}"
"""
        async for token in stream_llm(prompt=prompt):
            yield token, False
        yield "", True
        return

    # fallback
    yield {
        "message": "Sorry, I couldn’t find an exact answer. Let me connect you with a customer service agent.",
        "handover": True,
        "suggestions": ["Check-in time", "Room service menu", "Contact reception"]
    }, True


