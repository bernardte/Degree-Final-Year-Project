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
feature_names = joblib.load("models/load_dict/anomaly-detection-booking-session/feature_names.pkl")
scaler = joblib.load("models/load_dict/anomaly-detection-booking-session/scaler.pkl")

def anomaly_detection_booking_session(session: BookingSession) -> tuple[int, float]:
    # ---- 构建输入 DataFrame ----
    df = pd.DataFrame([{
        "totalPrice": session.totalPrice,
        "adults": session.adults,
        "children": session.children,
        "nights": session.nights,
        "roomNum": len(session.roomId)
    }])
    
    # ---- 保护防止除零 ----
    df["nights"] = df["nights"].replace(0, 1)
    total_people = df["adults"] + df["children"]
    total_people = total_people.replace(0, 1)

    # ---- 衍生特征 ----
    df["price_per_night"] = df["totalPrice"] / df["nights"]
    df["price_per_person"] = df["totalPrice"] / total_people
    df["children_ratio"] = df["children"] / total_people
    df["price_per_night_per_person"] = df["totalPrice"] / (df["nights"] * total_people)

    # ---- 对数变换 ----
    df["log_nights"] = np.log1p(df["nights"])
    df["log_totalPrice"] = np.log1p(df["totalPrice"])
    df["log_price_per_night"] = np.log1p(df["price_per_night"])
    df["log_price_per_person"] = np.log1p(df["price_per_person"])
    df["log_price_per_night_per_person"] = np.log1p(df["price_per_night_per_person"])

    # ---- 特征选择 & 标准化 ----
    feature_names = [
        "log_nights",
        "log_totalPrice",
        "log_price_per_night",
        "log_price_per_person",
        "log_price_per_night_per_person",
        "adults",
        "children",
        "children_ratio",
        "nights",
        "roomNum"
    ]
    X = df[feature_names]
    X_scaled = scaler.transform(X)

    # ---- 模型预测 ----
    prediction = bookingSession_anomaly_detection_model.predict(X_scaled)[0]
    score = bookingSession_anomaly_detection_model.decision_function(X_scaled)[0]
    print(f"prediction: {prediction}, score: {score}")
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
