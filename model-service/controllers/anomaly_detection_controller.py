import numpy as np
import joblib
from classes.interface import BookingSession
import pandas as pd

bookingSession_anomaly_detection_model = joblib.load("models/load_dict/anomaly-detection-booking-session/bookings_sessions_anomaly_detection.pkl")


def anomaly_detection_booking_session(session: BookingSession) -> tuple[int, float]:
    feature_cols = ["totalPrice", "adults", "children", "nights"]
    features = pd.DataFrame([{
        "totalPrice": session.totalPrice,
        "adults": session.adults,
        "children": session.children,
        "nights": session.nights
    }], columns=feature_cols)
    prediction = bookingSession_anomaly_detection_model.predict(features)[0]
    score = bookingSession_anomaly_detection_model.decision_function(features)[0]

    return prediction, score
