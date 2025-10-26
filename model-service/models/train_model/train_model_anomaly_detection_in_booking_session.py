import asyncio
from config.mongoDB import db
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib
import os

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
    df["nights"] = (df["checkOutDate"] - df["checkInDate"]).dt.days
    df = df[df["nights"] > 0]

    # --------- feature engineering ---------
    df["price_per_night"] = df["totalPrice"] / df["nights"]
    df["price_per_person"] = df["totalPrice"] / (df["adults"] + df["children"]).replace(0, 1)
    df["children_ratio"] = df["children"] / (df["adults"] + df["children"]).replace(0, 1)
    df["price_per_night_per_person"] = df["totalPrice"] / (
        df["nights"] * (df["adults"] + df["children"]).replace(0, 1)
    )

    # --------- Logarithmic transformation ---------
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
            "roomNum",
        ]
    ]

    # --------- normalization ---------
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(features)

    # --------- 训练 Isolation Forest ---------
    iso_model = IsolationForest(
        n_estimators=200,
        contamination=0.1,
        max_samples="auto",
        random_state=42,
    )
    df["iso_anomaly"] = iso_model.fit_predict(scaled_features)
    df["iso_score"] = iso_model.decision_function(scaled_features)

    # --------- 计算异常数量 ---------
    n_anomalies = (df["iso_anomaly"] == -1).sum()
    print(f"contamination=0.1, Number of anomalies detected={n_anomalies}")


    # --------- 计算正常数据均值 ---------
    normal_df = df[df["iso_anomaly"] == 1]
    normal_means = normal_df[features.columns].mean()

    # --------- 保存模型 ---------
    os.makedirs("models/load_dict/anomaly-detection-booking-session", exist_ok=True)
    joblib.dump(iso_model, "models/load_dict/anomaly-detection-booking-session/bookings_sessions_anomaly_detection.pkl")
    joblib.dump(scaler, "models/load_dict/anomaly-detection-booking-session/scaler.pkl")
    joblib.dump(features.columns.tolist(), "models/load_dict/anomaly-detection-booking-session/feature_names.pkl")
    joblib.dump(normal_means, "models/load_dict/anomaly-detection-booking-session/normal_means.pkl")

    # --------- 定义函数：找出每个异常样本的主要异常原因 ---------
    def get_anomaly_reason(row, normal_means):
        diffs = (row[features.columns] - normal_means)
        abs_diffs = diffs.abs()
        top_features = abs_diffs.sort_values(ascending=False).head(2).index.tolist()

        readable_names = {
            "log_nights": "Length of Stay",
            "log_totalPrice": "Total Price",
            "log_price_per_night": "Price per Night",
            "log_price_per_person": "Price per Person",
            "log_price_per_night_per_person": "Price per Night per Person",
            "adults": "Number of Adults",
            "children": "Number of Children",
            "children_ratio": "Children-to-Adult Ratio",
            "nights": "Nights Stayed",
            "roomNum": "Number of Rooms",
        }

        readable_reasons = []
        for f in top_features:
            direction = "higher than usual" if diffs[f] > 0 else "lower than usual"
            readable_reasons.append(f"{readable_names.get(f, f.replace('_', ' ').title())} is {direction}")

        return "; ".join(readable_reasons)


    # --------- 应用函数给每个异常样本 ---------
    anomalies = df[df["iso_anomaly"] == -1].copy()
    anomalies["reason"] = anomalies.apply(lambda row: get_anomaly_reason(row, normal_means), axis=1)

    # --------- 输出异常结果 ---------
    print("=== Abnormal Bookings Detected ===")
    print(anomalies[
        [
            "sessionId",
            "totalPrice",
            "nights",
            "adults",
            "children",
            "roomNum",
            "iso_score",
            "reason",
        ]
    ].sort_values("iso_score"))

    return anomalies[
        [
            "sessionId",
            "totalPrice",
            "nights",
            "adults",
            "children",
            "roomNum",
            "iso_score",
            "reason",
        ]
    ].to_dict(orient="records")

# 运行主函数
results = asyncio.run(main())

# 打印部分返回结果
for r in results[:5]:
    print(r)
