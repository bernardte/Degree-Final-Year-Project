import torch
from torch import nn
import joblib
import numpy as np
import pandas as pd

scaler = joblib.load("models/load_dict/anomaly-detection/scaler.pkl")
le = joblib.load("models/load_dict/anomaly-detection/label_encoder.pkl")
threshold = joblib.load("models/load_dict/anomaly-detection/threshold.pkl")
features = [
            "totalPrice", 
            "totalGuestsNum", 
            "bookingInterval", 
            "refundAmount", 
            "rewardDiscount", 
            "roomEncoded",
            "advanceBookingDays",
            "nights",
            ]
class LSTMAutoencoder(nn.Module):
    def __init__(self, n_features, hidden_size, seq_len):
        super().__init__()
        self.seq_len = seq_len
        self.hidden_size = hidden_size

        self.encoder = nn.LSTM(
            input_size=n_features, hidden_size=hidden_size,
            batch_first=True
        )

        self.decoder = nn.LSTM(
            input_size=hidden_size, hidden_size=hidden_size,
            batch_first=True
        )

        self.output_layer = nn.Linear(
            in_features=hidden_size, out_features=n_features
        )

        nn.ReLU()

    def forward(self, x):
        _, (hidden, _) = self.encoder(x)
        hidden_repeated = hidden.repeat(self.seq_len, 1, 1).transpose(0, 1)
        decoded,_ = self.decoder(hidden_repeated)
        out = self.output_layer(decoded)

        return out

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = LSTMAutoencoder(n_features=len(features), hidden_size=32, seq_len=5)
model.load_state_dict(torch.load("models/load_dict/anomaly-detection/bookings_anomaly_detection.pth", map_location=device))
model.to(device=device)
model.eval()

def preprocess_booking(df):
    df = df.copy()
    df["bookingDate"] = pd.to_datetime(df["bookingDate"])

    df["userId"] = df.apply(lambda row: row["bookingCreatedByUser"] if row["userType"] == "user" else row["guestId"], axis=1)
    df["adults"] = df["totalGuests"].apply(lambda x: x.get("adults", 0) if isinstance(x, dict) else 0)
    df["children"] = df["totalGuests"].apply(lambda x: x.get("children", 0) if isinstance(x, dict) else 0)
    df["totalGuestsNum"] = df["adults"] + df["children"]


    # interval
    df = df.sort_values(["userId", "bookingDate"])
    df["bookingInterval"] = df.groupby("userId")["bookingDate"].diff().dt.total_seconds()
    df["bookingInterval"] = df["bookingInterval"].fillna(0)

    df["checkInDate"] = pd.to_datetime(df["startDate"])
    df["checkOutDate"] = pd.to_datetime(df["endDate"])
    df["nights"] = (df["checkOutDate"] - df["checkInDate"]).dt.days
    df["nights"] = df["nights"].fillna(0).clip(lower=0)
    df["advanceBookingDays"] = (df["checkInDate"] - df["bookingDate"]).dt.days
    df["advanceBookingDays"] = df["advanceBookingDays"].fillna(0).clip(lower=0)

    df["room"] = df["room"].apply(lambda x: str(x[0]) if isinstance(x, list) and x else "unknown")
    df["roomEncoded"] = df["room"].apply(lambda x: le.transform([x])[0] if x in le.classes_ else 0)

    # Only keep feature columns
    for f in features:
        if f not in df.columns:
            df[f] = 0
    scaled_features = scaler.transform(df[features])
    for i, f in enumerate(features):
        df[f] = scaled_features[:, i]

    df["features"] = df[features].values.tolist()
    return df

def build_sequences(df, seq_len=5):
    all_sequences, indices = [], []
    for userId, group in df.groupby("userId"):
        values = group["features"].tolist()
        for i in range(len(values) - seq_len):
            all_sequences.append(values[i:i+seq_len])
            indices.append(group.index[i + seq_len])

    return np.array(all_sequences, dtype=np.float32), indices

def detect_booking_anomalies(df_new: pd.DataFrame) -> pd.DataFrame:
    df_prep = preprocess_booking(df_new)
    x_seq, indices = build_sequences(df_prep, seq_len=5)

    if len(x_seq) == 0:
        # 返回一个空 DataFrame，但保留列结构
        return pd.DataFrame(columns=df_new.columns.tolist() + ["isAnomaly", "reconstructionError"])

    X_tensor = torch.tensor(x_seq, dtype=torch.float32).to(device)

    with torch.inference_mode():
        reconstructions = model(X_tensor)
        mse = torch.mean((X_tensor - reconstructions) ** 2, dim=(1, 2)).detach().cpu().numpy()

    anomalies_index = np.where(mse > threshold)[0]

    df_result = df_prep.loc[indices].copy()
    df_result["reconstructionError"] = mse
    df_result["isAnomaly"] = df_result.index.isin(df_prep.index[indices][anomalies_index])

    # merge 回原始数据以保留 bookingReference 等
    df_result = df_result.merge(
        df_new[["bookingReference", "userEmail", "bookingCreatedByUser"]],
        how="left",
        left_on="bookingReference",
        right_on="bookingReference",
        suffixes=("", "_orig")
    )

    df_result = df_result[df_result["isAnomaly"] == True]

    if df_result.empty:
        return pd.DataFrame(columns=["bookingReference", "userEmail", "bookingCreatedByUser", "reconstructionError", "isAnomaly"])

    return df_result[["bookingReference", "userEmail", "bookingCreatedByUser", "reconstructionError", "isAnomaly"]].copy()
