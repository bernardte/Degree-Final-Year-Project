# ---------------------------- Finite State Machine----------------------#
FSM = {
    "change_booking": ["ask_booking_reference", "ask_new_date", "confirm_change"],
    "cancel": ["ask_order_id", "confirm_cancel"],
    "booking": ["ask_check_in_date", "ask_check_out_date", "ask_room_type"],
    "complaint": ["ask_issue_detail", "apologize_and_log"],
    "chat": ["respond_to_chat"],
    "greeting": ["greet_user"],
    "goodbye": ["farewell"],
    "check_status": ["ask_order_id", "provide_status"]
}

# ---------------------------- Template For FSM ---------------------------- #
TEMPLATES = {
    "ask_booking_reference": "Please provide your booking Reference and email.",
    "ask_new_date": "What date would you like to change your booking to?",
    "confirm_change": "Your booking has been updated. Is there anything else I can help you with?",

    "ask_order_id": "May I have your order ID?",
    "confirm_cancel": "Your order has been cancelled successfully.",

    "ask_check_check_in_datekdates": "When is the check-in date would you like to book?",
    "ask_check_out_date": "When is the check-out date would you like to book?",
    "ask_room_type": "What type of room would you prefer?",

    "ask_issue_detail": "Could you describe the issue you're facing?",
    "apologize_and_log": "We’re sorry to hear that. We've logged your complaint and will follow up soon.",

    "respond_to_chat": "How can I assist you today?",
    "greet_user": "Hello! How can I help you?",
    "farewell": "Goodbye! Have a great day!",
    "provide_status": "Your order is being processed. We'll notify you once it's ready.",
}

# ---------------------------- No suggestion returned -----------#
NO_SUGGESTION_INTENTS = {"goodbye", "chat"}
