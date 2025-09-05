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

    if any(kw in user_input for kw in ["human", "customer service", "Real people", "agent", "Transfer to manual", "real agent"]):
        await redis_client.delete(conversationId)
        prompt = """
You are Harold, a polite and professional hotel assistant.

The user has requested to speak with a human agent.

Your task:
- Politely acknowledge the request.
- Apologize briefly for not being able to fully assist.
- Clearly inform the user that they are being transferred to a customer service representative.
- Keep the reply short (1–2 sentences).
- Do not include extra explanations or unrelated information.
"""

        async for token in stream_llm(prompt=prompt):
            yield token, False
        
        yield "", True
        return


    current_state = await redis_client.get(conversationId)
    step = 0
    if not current_state:
        intent = await detect_intent(user_input)
        print(f"model detected 1: {intent}")
        await redis_client.set(conversationId, intent)
    else:
        if ":" in current_state:
            intent, step = current_state.split(":")
            step = int(step)
        else:
            intent = current_state
            step = 0

    # Detect whether to switch intent
    new_intent = await detect_intent(user_input=user_input)
    print(f"model detected 2: {new_intent}")

    if new_intent != intent:
        intent = new_intent
        step = 0
        await redis_client.set(conversationId, intent)

    # FSM Logic
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
            template_instruction = TEMPLATES.get(
                response_key,
                f"{intent.capitalize()} {response_key.replace('-', ' ')}"
            )

            # 用 LLM 基于模板生成自然回复
            prompt = f"""
    You are Harold, a polite and professional hotel assistant.

    The current conversation intent is: "{intent}".
    The current step is: "{response_key}".

    Your task:
    - Follow the instruction: "{template_instruction}".
    - Generate a polite, natural-sounding response.
    - Keep the response concise (1-2 sentences).
    """

            async for token in stream_llm(prompt=prompt):
                yield token, False

            await redis_client.set(conversationId, f"{intent}:{step + 1}")
            yield "", True
            return
        else:
            await redis_client.delete(conversationId)
            yield f"Your request to {intent.replace('_', ' ')} has been completed.", True
            return

    # FAQ Search
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

    # fallback (streaming text instead of dict)
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



