from fastapi.responses import JSONResponse
from fastapi import Request
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
from typing import AsyncGenerator, Any
from utils.bookings import get_all_room_types
import inspect
import json


async def handle_chatbot(payload: dict) -> AsyncGenerator[tuple[Any, bool], None]:
    conversationId = payload.get("conversationId") 
    question = payload.get("question")
    user_input = question.strip() if question else ""
    context = payload.get("context", "")
    senderId = payload.get("senderId")
    senderType = payload.get("senderType")  # guest / member
    chat_context = context
    if conversationId is None or user_input == "" or senderId is None or senderType is None:
        return

    await update_conversation_context(str(conversationId), str(senderType), user_input)
    chat_context = await get_conversation_context(conversationId)
    # --- User requests to be transferred to manual customer service ---
    if any(kw in user_input.lower() for kw in ["human", "customer service", "real people", "agent", "transfer to manual", "real agent", "real human", "real assistant"]):
        await redis_client.delete(conversationId)
        prompt = """
You are Harold, a polite and professional hotel assistant.

The user has requested to speak with a human agent.

Your task:
- Politely acknowledge the request.
- Clearly inform the user that they are being transferred to a customer service representative.
- Keep the reply short (1–2 sentences).
"""
        async for token in stream_llm(prompt=prompt):
            yield token, False
        yield "", True


        await update_conversation_context(conversationId, senderId, user_input)
        yield {
            "fulfillmentText": "OK, I'm transferring you to manual customer service, please wait...",
            "handover_to_human": True
        }, True
        return 
        

    # --- Check the current conversation status ---
    current_state = await redis_client.get(conversationId)
    print(f"[DEBUG] Current state from Redis: {current_state}")
    
    step = 0
    intent = None

    # --- new conversation ---
    if not current_state:
        intent = await detect_intent(user_input)
        print(f"intent detected: {intent}")

        # Set the initial state
        if intent in FSM:
            await redis_client.set(conversationId, f"{intent}:0")
            print(f"[DEBUG] Set new state: {intent}:0")
        else:
            intent = None

    else:
        # Analyze the current state
        if ":" in current_state:
            intent, step_str = current_state.split(":")
            step = int(step_str)
            print(f"[DEBUG] Parsed state - intent: {intent}, step: {step}")
        else:
            intent = current_state
            step = 0

    # --- Booking FSM ---
    if intent == "booking":
        async for token, is_final in handle_booking_flow(
            conversationId=conversationId,
            user_input=user_input,
            senderType=senderType,
            senderId=senderId,
            step=step,
            current_state=current_state
        ):
            yield token, is_final
        return

    # --- If it is not the booking process, check the FAQ ---
    score, faq = await find_best_faq(query=user_input)
    print("FAQ found:", faq)
    print("Score:", score)
    
    # Use FAQ only when there is no active conversation
    if faq.get("answer") and score >= 0.5:
        prompt = f"""
You are Harold, a polite and professional hotel assistant.

Always respond using the most relevant retrieved FAQ answer when available.

If the user greets with "hi" (or similar greetings) in the first message, politely introduce yourself by name ("Harold").

After the introduction, do not repeat your name in subsequent responses unless directly asked.

Keep replies polite, helpful, and concise.

If no relevant FAQ answer is found, provide a helpful general response.

Conversation so far:
{chat_context}

Relevant FAQ:
Q: {faq['question']}
A: {faq['answer']}

User Question: "{user_input}"
"""
        async for token in stream_llm(prompt=prompt):
            yield token, False
        yield "", True
        await update_conversation_context(conversationId,senderType, user_input)
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
    await update_conversation_context(conversationId,senderType, user_input)


async def handle_booking_flow(conversationId: str, user_input: str, senderType: str, senderId: str, step: int, current_state: str):
    """Handling the booking process"""
    steps = FSM["booking"]
    
    print(f"[BOOKING FLOW] Step: {step}, Total steps: {len(steps)}")
    print(f"[BOOKING FLOW] Steps: {steps}")

    # Get all saved entities
    saved_entities: Dict[str, str] = await redis_client.hgetall(f"{conversationId}:entities") or {} #type: ignore
    print(f"[BOOKING FLOW] Saved entities: {saved_entities}")

    # --- Save the user input from the previous step ---
    if step > 0 and step <= len(steps):
        prev_step_key = steps[step - 1]
        print(f"[BOOKING FLOW] Saving user input for previous step: {prev_step_key} = '{user_input}'")
        
        # Saving user input
        await redis_client.hset(f"{conversationId}:entities", prev_step_key, user_input) #type: ignore
        
        # Try to extract structured entities
        extracted = await extract_specific_entity(user_input, prev_step_key)
        if extracted:
            entity_key, entity_value = extracted
            await redis_client.hset(f"{conversationId}:entities", entity_key, entity_value) #type: ignore
            print(f"[BOOKING FLOW] Extracted entity: {entity_key} = {entity_value}")

    # Reload a saved entity
    saved_entities = await redis_client.hgetall(f"{conversationId}:entities") or {} #type: ignore
    print(f"[BOOKING FLOW] Updated saved entities: {saved_entities}")

    # --- If there is a next step ---
    if step < len(steps):
        next_step = steps[step]
        print(f"[BOOKING FLOW] Next step: {next_step}")
         # If current step is asking for room type, fetch list from MongoDB
        if next_step == "ask_room_type":
            room_types = await get_all_room_types()
            room_list_text = "\n".join([f"- {r}" for r in room_types])
            extra_info = f"\n\nHere are the available room types you can choose from:\n{room_list_text}"
        else:
            extra_info = ""
        # Update the state to the current step (do not increase the step in advance)
        await redis_client.set(conversationId, f"booking:{step}")
        
        # Generate prompts for the next step
        template_text = TEMPLATES.get(next_step, f"Please provide your {next_step}")
        prompt = await build_booking_prompt(next_step, template_text, saved_entities, user_input)

        # Add available room list if present
        prompt += extra_info
        async for token in stream_llm(prompt=prompt):
            yield token, False
        yield "", True
        await update_conversation_context(conversationId,senderType, user_input)

        
        # Increment the step only after the user responds
        await redis_client.set(conversationId, f"booking:{step + 1}")
        print(f"[BOOKING FLOW] Updated state to: booking:{step + 1}")
        return
    else:
        print("[BOOKING FLOW] All steps completed, creating booking...")
        
        # Debug: Print the current entity state
        saved_entities_before = await redis_client.hgetall(f"{conversationId}:entities") or {} #type: ignore
        print(f"[DEBUG] Entities before final extraction: {saved_entities_before}")
        
        booking_result = await extract_entities_for_booking_session(
            user_input=user_input,
            userType=senderType,
            conversationId=conversationId,
            senderId=senderId
        )
        
        if booking_result:
            confirm_link, error = booking_result
            print(f"[BOOKING FLOW] Booking result - Link: {confirm_link}, Error: {error}")
            if error:
                async for token in stream_llm(prompt=f"Sorry, there was an error: {error}"):
                    yield token, False
                yield "", True
            else:
                success_message = f"""
    Great! I've created your booking session. 

    1. Link: {confirm_link}  to redirect and proceed to the payment summary
    2. No need to show all the collected info again, just provide the link and a polite closing remark.

    Thank you for choosing our hotel!
    """
                async for token in stream_llm(prompt=success_message):
                    yield token, False
                yield "", True

        # Cleaning up conversation state
        await redis_client.delete(conversationId)
        await redis_client.delete(f"{conversationId}:entities")
        return


async def extract_specific_entity(text: str, step_key: str) -> tuple[str, str] | None:
    """Extract specific entities based on step keys"""
    if step_key == "checkInDate":
        date = await extract_date_entity(text)
        if date:
            return "checkInDate", date
    elif step_key == "checkOutDate":
        date = await extract_date_entity(text)
        if date:
            return "checkOutDate", date
    elif step_key == "roomTypes":
        room_type = await extract_room_type(text)
        if room_type:
            return "roomTypes", room_type
    elif step_key == "contactName":
        name = await extract_name(text)
        if name:
            return "contactName", name
    elif step_key == "contactEmail":
        email = await extract_email(text)
        if email:
            return "contactEmail", email
    elif step_key == "contactNumber":
        phone = await extract_phone(text)
        if phone:
            return "contactNumber", phone
    
    return None


async def build_booking_prompt(step: str, template: str, saved_entities: Dict[str, str], user_input: str) -> str:
    """Tips for structuring booking process"""
    context_info = ""
    if saved_entities:
        # Formatting the collected information
        collected_info = []
        for key, value in saved_entities.items():
            if value and value.strip():
                collected_info.append(f"{key}: {value}")
        
        if collected_info:
            context_info = f"\n\nSo far I have collected: {', '.join(collected_info)}"
    
    return f"""
You are Harold, a polite and professional hotel assistant helping a customer with room booking.

Current booking step: {step}
What to ask next: {template}
User's last input: "{user_input}"{context_info}

Your task:
1. Politely ask for: {template}
2. Be conversational and friendly
3. If the user provided relevant information in their last message, acknowledge it briefly
4. Guide them to provide the specific information needed

Keep your response focused and natural. Do not list multiple questions at once.
"""


# Simplified entity extraction helper functions
async def extract_date_entity(text: str) -> str:
    """extract date entity"""
    import re
    from datetime import datetime
    
    # Date format matching
    date_patterns = [
        r'(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})',
        r'(\d{1,2})\s+(\w+)\s+(\d{2,4})'
    ]
    
    for pattern in date_patterns:
        match = re.search(pattern, text)
        if match:
            try:
                if '/' in text or '-' in text:
                    d, m, y = match.groups()
                    if len(y) == 2:
                        y = f"20{y}"
                    return f"{y}-{int(m):02d}-{int(d):02d}"
            except:
                pass
    return ""

async def extract_room_type(text: str) -> str:
    """extract room type entity"""
    room_types = ["deluxe", "standard", "family", "suite", "single", "double", "twin", "executive", "presidential"]
    text_lower = text.lower()
    
    for room_type in room_types:
        if room_type in text_lower:
            return room_type + " room"
    
    return ""

async def extract_name(text: str) -> str:
    """extra name entity"""
    # Simple implementation - more complex NLP should be used in real applications
    import re
    name_pattern = r'[A-Z][a-z]+ [A-Z][a-z]+'
    match = re.search(name_pattern, text)
    return match.group() if match else ""

async def extract_email(text: str) -> str:
    """extra email entity"""
    import re
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    match = re.search(email_pattern, text)
    return match.group() if match else ""

async def extract_phone(text: str) -> str:
    """extract phone number entity"""
    import re
    phone_pattern = r'(\+?(\d{1,3})?[\s-]?)?(\(?\d{3}\)?[\s-]?\d{3,4}[\s-]?\d{3,4})'
    match = re.search(phone_pattern, text)
    return match.group() if match else ""



async def update_conversation_context(conversationId: str, role: str, message: str, max_history: int = 5):
    """
Updates the conversation context record in Redis.
- conversationId: Conversation ID
- role: "user" or "assistant"
- message: Conversation message
- max_history: Maximum number of conversations to retain (user + assistant counts as one conversation)
    """
    key = f"{conversationId}:context"

    # Get the current history
    history_data = await redis_client.get(key)
    if history_data:
        history = json.loads(history_data)
    else:
        history = []

    # append new messages
    history.append({"role": role, "content": message})

    # Limit the number of records saved to N (FIFO)
    if len(history) > max_history * 2:  # 每轮2条（user+assistant）
        history = history[-max_history * 2:]

    # Save back to Redis
    await redis_client.set(key, json.dumps(history))
    return history


async def get_conversation_context(conversationId: str, max_history: int = 5) -> str:
    """Get the formatting context (string, used for prompt)"""
    key = f"{conversationId}:context"
    history_data = await redis_client.get(key)
    if not history_data:
        return ""

    history = json.loads(history_data)

    # Only keep the most recent max_history entries
    history = history[-max_history * 2:]

    # Formatted as prompt-friendly text
    context_lines = []
    for msg in history:
        role = "User" if msg["role"] == "user" else "Harold"
        context_lines.append(f"{role}: {msg['content']}")
    return "\n".join(context_lines)
