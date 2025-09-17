import asyncio
from config.mongoDB import db
import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib
import os

booking_session_collection = db["bookingsessions"]

async def load_sessions():
    sessions = []
    cursor = booking_session_collection.find({})
    async for doc in cursor:
        sessions.append(doc)
    return sessions

async def main():
    sessions = await load_sessions()
    df = pd.DataFrame(sessions)

    # 数据预处理
    df["checkOutDate"] = pd.to_datetime(df["checkOutDate"])
    df["checkInDate"] = pd.to_datetime(df["checkInDate"])

    df["adults"] = df["totalGuest"].apply(lambda x: x.get("adults") if isinstance(x, dict) else 0)
    df["children"] = df["totalGuest"].apply(lambda x: x.get("children") if isinstance(x, dict) else 0)

    df["nights"] = (df["checkOutDate"] - df["checkInDate"]).dt.days
    features = df[["totalPrice", "adults", "children", "nights"]]

    # 训练 IsolationForest
    iso_model = IsolationForest(n_estimators=100, contamination=0.1, random_state=42)
    df["iso_anomaly"] = iso_model.fit_predict(features)
    df["iso_score"] = iso_model.decision_function(features)

    # 保存模型
    os.makedirs("models/load_dict/anomaly-detection-booking-session", exist_ok=True)
    joblib.dump(iso_model, "models/load_dict/anomaly-detection-booking-session/bookings_sessions_anomaly_detection.pkl")

    # 输出异常结果
    print("=== Price & People Anomalies Detected ===")
    print(df[df["iso_anomaly"] == -1][["sessionId", "totalPrice", "adults", "children", "iso_score"]])

# 运行
asyncio.run(main())
