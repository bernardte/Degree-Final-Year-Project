import asyncio
from config.mongoDB import db
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib
import os
import matplotlib.pyplot as plt
import seaborn as sns

booking_session_collection = db["bookingsessions"]

# ========================= 数据加载 ========================= #
async def load_sessions():
    sessions = []
    cursor = booking_session_collection.find({})
    async for doc in cursor:
        sessions.append(doc)
    return sessions

# ========================= 主函数 ========================= #
async def main():
    sessions = await load_sessions()
    df = pd.DataFrame(sessions)

    # --------- 数据预处理 ---------
    df["checkOutDate"] = pd.to_datetime(df["checkOutDate"], errors="coerce")
    df["checkInDate"] = pd.to_datetime(df["checkInDate"], errors="coerce")

    df["adults"] = df["totalGuest"].apply(lambda x: x.get("adults") if isinstance(x, dict) else 0)
    df["children"] = df["totalGuest"].apply(lambda x: x.get("children") if isinstance(x, dict) else 0)
    df["roomNum"] = df["roomId"].apply(lambda x: len(x) if isinstance(x, list) else 1)
    df["roomNum"] = pd.to_numeric(df["roomNum"], errors="coerce").fillna(1).astype(int)
    print(f"roomNum: {df["roomNum"].dtype}")
    df["nights"] = (df["checkOutDate"] - df["checkInDate"]).dt.days
    df = df[df["nights"] > 0]  # 删除无效日期

    # --------- 特征工程 ---------
    df["price_per_night"] = df["totalPrice"] / df["nights"]
    df["price_per_person"] = df["totalPrice"] / (df["adults"] + df["children"]).replace(0, 1)
    df["children_ratio"] = df["children"] / (df["adults"] + df["children"]).replace(0, 1)
    df["price_per_night_per_person"] = df["totalPrice"] / (df["nights"] * (df["adults"] + df["children"]).replace(0,1))

    # 对数变换
    df["log_nights"] = np.log1p(df["nights"])
    df["log_totalPrice"] = np.log1p(df["totalPrice"])
    df["log_price_per_night"] = np.log1p(df["price_per_night"])
    df["log_price_per_person"] = np.log1p(df["price_per_person"])
    df["log_price_per_night_per_person"] = np.log1p(df["price_per_night_per_person"])

    features = df[
        [
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
    ]

    # --------- normalization ---------
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(features)

    # --------- 训练模型 ---------
    iso_model = IsolationForest(
        n_estimators=200,
        contamination=0.1,
        max_samples='auto',
        random_state=42
    )

    # 训练模型并预测
    df["iso_anomaly"] = iso_model.fit_predict(scaled_features)
    df["iso_score"] = iso_model.decision_function(scaled_features)

    # IsolationForest 返回值：1 表示正常，-1 表示异常
    n_anomalies = (df["iso_anomaly"] == -1).sum()
    print(f"contamination={0.1}, Number of anomalies detected={n_anomalies}")
    # --------- 保存模型 ---------
    os.makedirs("models/load_dict/anomaly-detection-booking-session", exist_ok=True)
    joblib.dump(iso_model, "models/load_dict/anomaly-detection-booking-session/bookings_sessions_anomaly_detection.pkl")
    joblib.dump(scaler, "models/load_dict/anomaly-detection-booking-session/scaler.pkl")
    joblib.dump(features.columns.tolist(), "models/load_dict/anomaly-detection-booking-session/feature_names.pkl")

    # --------- 输出异常结果 ---------
    anomalies = df[df["iso_anomaly"] == -1][
        ["sessionId", "totalPrice", "nights", "adults", "children", "price_per_night", "price_per_person", "price_per_night_per_person" ,"roomNum", "iso_score"]
    ]
    print("=== Price & Guest Anomalies Detected ===")
    print(anomalies.sort_values("iso_score"))

asyncio.run(main())
