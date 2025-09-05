from config.mongoDB import db
import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib

booking_session_collection = db["bookingsessions"]

sessions = list(booking_session_collection.find())

df = pd.DataFrame(sessions)

# preprocessing
df["checkOutDate"] = pd.to_datetime(df["checkOutDate"])
df["checkInDate"] = pd.to_datetime(df["checkInDate"])

df["adults"] = df["totalGuest"].apply(lambda x: x.get("adults") if isinstance(x, dict) else 0)
df["children"] = df["totalGuest"].apply(lambda x: x.get("children") if isinstance(x, dict) else 0)

df["nights"] = (df["checkOutDate"] - df["checkInDate"]).dt.days
features = df[["totalPrice", "adults", "children", "nights"]]

# called model object
iso_model = IsolationForest(n_estimators=100, contamination=0.1, random_state=42) # assume 10% data abnormal

# train model and predict
df["iso_anomaly"] = iso_model.fit_predict(features)
df["iso_score"] = iso_model.decision_function

joblib.dump(iso_model, "models/load_dict/anomaly-detection-booking-session/bookings_sessions_anomaly_detection.pkl")

# result
print("=== Price & People Anomalies Detected ===")
print(df[df["iso_anomaly"] == -1][["sessionId", "totalPrice", "adults", "children", "iso_score"]])