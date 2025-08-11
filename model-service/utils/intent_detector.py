from models import predict_intent

async def detect_intent(user_input: str) -> str:

    print(f"Detecting intent for user input: {user_input}")
    intent = predict_intent(user_input)
    
    return intent