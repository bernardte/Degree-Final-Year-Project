import numpy as np
import joblib
from classes.interface import BookingSession
from classes.interface import BookingList
import pandas as pd
from models.bookingAnomalyDetection import detect_booking_anomalies
from datetime import datetime, timedelta, timezone
from config.mongoDB import db
from fastapi.encoders import jsonable_encoder
from utils.convert_object_id_to_string import clean_mongo_object
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

async def anomaly_detection_booking():
    cursor = db["bookings"].find(
        { },
        {
            "bookingReference": 1,
            "userEmail": 1,
            "guestId": 1,
            "userType": 1,
            "bookingDate": 1,
            "totalPrice": 1,
            "refundAmount": 1,
            "rewardDiscount": 1,
            "paymentMethod": 1,
            "status": 1,
            "bookingCreatedByUser": 1,
            "totalGuests": 1,
            "room": 1,
            "startDate": 1,
            "endDate": 1,
        }
    )
    docs = await cursor.to_list(length=None)
    print(f"anomaly detect in booking: {docs}")
    if not docs:
        return []
    
    df = pd.DataFrame(docs)
    df_result = detect_booking_anomalies(df)
    
    if df_result is None or df_result.empty:
        return []
    print(f"detect anomaly result: {df_result}")
    result = df_result.to_dict(orient="records")
    result = clean_mongo_object(result)
    return result
