from fastapi.responses import JSONResponse  # customize json response
import asyncio
# own modules
from config.redis import redis_client
from utils.intent_detector import detect_intent
from constants.FSM_constant import FSM, TEMPLATES, NO_SUGGESTION_INTENTS
from models import stream_llm
from retrieval import find_best_faq
from utils.entity_extractor import extract_entities
from utils.extract_entities_for_booking_session import extract_entities_for_booking_session
from typing import Dict
from datetime import datetime
import json
from utils.bookings import add_booking


async def handle_chatbot(payload):
    conversationId = payload.get("conversationId")
    question = payload.get("question")
    user_input = question.strip()
    context = payload.get("context", "")
    senderId = payload.get("senderId")
    senderType = payload.get("senderType")  # guest 或 member
    chat_context = context

    # --- 用户要求转人工客服 ---
    if any(kw in user_input.lower() for kw in ["human", "customer service", "real people", "agent", "transfer to manual", "real agent"]):
        await redis_client.delete(conversationId)
        prompt = """
You are Harold, a polite and professional hotel assistant.

The user has requested to speak with a human agent.

Your task:
- Politely acknowledge the request.
- Apologize briefly for not being able to fully assist.
- Clearly inform the user that they are being transferred to a customer service representative.
- Keep the reply short (1–2 sentences).
"""
        async for token in stream_llm(prompt=prompt):
            yield token, False
        yield "", True
        return

    # --- 检查当前对话状态 ---
    current_state = await redis_client.get(conversationId)
    step = 0

    # --- 新会话 ---
    if not current_state:
        intent = await detect_intent(user_input)
        print(f"intent detected: {intent}")

        if intent == "change_booking":
            entities = extract_entities(user_input=user_input)
            if any(entities.values()):
                await redis_client.hset(f"{conversationId}:entities", mapping=entities)  # type: ignore
                print(f"extracted entities: {entities}")
            await redis_client.set(conversationId, intent)

        if intent == "booking":
            # 尝试一次性解析所有字段
            booking_result = await extract_entities_for_booking_session(
                user_input=user_input,
                userType=senderType,
                conversationId=conversationId,
                senderId=senderId
            )
            if booking_result:  # 如果一次性信息齐全 → 直接建单
                confirm_link, error = booking_result
                if error:
                    async for token in stream_llm(prompt=f"Sorry, {error}"):
                        yield token, False
                    yield "", True
                else:
                    async for token in stream_llm(prompt=f"Your booking session is created. Please confirm here: {confirm_link}"):
                        yield token, False
                    yield "", True
                    await redis_client.delete(conversationId)
                return
            else:
                # 不完整 → 进入 FSM
                await redis_client.set(conversationId, intent)

    # --- 已有会话 ---
    else:
        if ":" in current_state:
            intent, step = current_state.split(":")
            step = int(step)
        else:
            intent = current_state
            step = 0

    # --- Booking FSM ---
    if intent == "booking":

        print(f"reached here {step}")
        # 必填字段（所有用户）
        required_steps = ["checkInDate", "checkOutDate", "roomType"]

        # guest 用户需要额外提供联系人信息
        if senderType == "guest":
            required_steps += ["contactName", "contactEmail", "contactNumber"]

        # 获取 Redis 里的已有信息
        saved_entities: Dict[str, str] = await redis_client.hgetall(f"{conversationId}:entities")  # type: ignore

        # 找出下一个缺少的字段
        next_step = None
        for s in required_steps:
            if not saved_entities.get(s):
                next_step = s
                print(f"next step: {next_step}")
                break

        if next_step:
            # 还缺少字段 → 问用户
            template_instruction = TEMPLATES.get(
                next_step,
                f"Please provide your {next_step.replace('-', ' ')}"
            )

            extra_info = ""
            result = saved_entities
            print(f"Your entities: {result}")
            if saved_entities.get("checkInDate"):
                extra_info += f"\nKnown user's check-in Date: {saved_entities['checkInDate']}"
            if saved_entities.get("checkOutDate"):
                extra_info += f"\nKnown user's check-out Date: {saved_entities['checkOutDate']}"
            if saved_entities.get("roomType"):
                extra_info += f"\nKnown user room type: {saved_entities['roomType']}"
            if saved_entities.get("contactName"):
                extra_info += f"\nKnown user contact name: {saved_entities['contactName']}"
            if saved_entities.get("contactEmail"):
                extra_info += f"\nKnown user contact email: {saved_entities['contactEmail']}"
            if saved_entities.get("contactNumber"):
                extra_info += f"\nKnown user contact number: {saved_entities['contactNumber']}"

            prompt = f"""
You are Harold, a polite and professional hotel assistant.

The user is making a booking.
Your task:
- Ask the user for their "{next_step}".
- next instruction is this "{template_instruction}"
- Keep response short and polite.
{extra_info}
"""
            async for token in stream_llm(prompt=prompt):
                yield token, False
            yield "", True
            return

        else:
            # 所有必填字段齐全 → 创建 booking
            booking_result = await extract_entities_for_booking_session(
                user_input=user_input,
                userType=senderType,
                conversationId=conversationId,
                senderId=senderId
            )
            if booking_result:
                confirm_link, error = booking_result
                if error:
                    async for token in stream_llm(prompt=f"Sorry, {error}"):
                        yield token, False
                    yield "", True
                else:
                    async for token in stream_llm(prompt=f"Your booking session is created. Please confirm here: {confirm_link}"):
                        yield token, False
                    yield "", True

            await redis_client.delete(conversationId)
            return

    # --- FAQ ---
    score, faq = await find_best_faq(query=user_input)
    print("FAQ found:", faq)
    print("Score:", score)
    if faq.get("answer") and score >= 0.5:
        history = "\n".join(
            f"{m['role']}: {m.get('content', '')}"
            for m in chat_context if "role" in m
        )
        prompt = f"""
You are Harold, a polite and professional hotel assistant.

Always respond using the most relevant retrieved FAQ answer when available.

If the user greets with "hi" (or similar greetings) in the first message, politely introduce yourself by name ("Harold").

After the introduction, do not repeat your name in subsequent responses unless directly asked.

Keep replies polite, helpful, and concise.

If no relevant FAQ answer is found, provide a helpful general response.
Relevant FAQ:
Q: {faq['question']}
A: {faq['answer']}

User Question: "{user_input}"
"""
        async for token in stream_llm(prompt=prompt):
            yield token, False
        yield "", True
        return

    # --- Fallback ---
    prompt = (
        "Write a professional and polite fallback response for a chatbot. "
        "The response should: "
        "1) Acknowledge that it cannot find an exact answer, "
        "2) Apologize politely, "
        "3) Offer to connect the user with a customer service agent for further assistance."
    )
    async for token in stream_llm(prompt=prompt):
        yield token, False
    yield "", True
