import torch 
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import numpy as np
import pandas as pd
from tqdm.auto import tqdm
from sklearn.preprocessing import MinMaxScaler, LabelEncoder 
import joblib
import asyncio
from config.mongoDB import db

# Connect to MongoDB
booking_collection = db["bookings"]
SEQ_LEN = 5

async def load_booking():
  cursor =  booking_collection.find({}, {
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
  })

  docs = []
  async for doc in cursor:
    docs.append(doc)
  return pd.DataFrame(docs)

df = asyncio.run(load_booking())
df = df[df["status"] != "cancelled"]

scaler = MinMaxScaler()

df["bookingDate"] = pd.to_datetime(df["bookingDate"])
df["checkInDate"] = pd.to_datetime(df["startDate"])
df["checkOutDate"] = pd.to_datetime(df["endDate"])

# Generate a unified userId
df["userId"] = df.apply(
  lambda row: row["bookingCreatedByUser"] if row["userType"] == "user" else row["guestId"], axis=1
)

df["nights"] = (df["checkOutDate"] - df["checkInDate"]).dt.days
df["nights"] = df["nights"].fillna(0).clip(lower=0)
df["advanceBookingDays"] = (df["checkInDate"] - df["bookingDate"]).dt.days
df["advanceBookingDays"] = df["advanceBookingDays"].fillna(0).clip(lower=0)

df = df.sort_values(["userId", "bookingDate"])
df = df.groupby("userId").filter(lambda x: len(x) > 1)

df["adults"] = df["totalGuests"].apply(lambda x: x.get("adults", 0) if isinstance(x, dict) else 0)
df["children"] = df["totalGuests"].apply(lambda x: x.get("children", 0) if isinstance(x, dict) else 0)
df["totalGuestsNum"] = df["adults"] + df["children"]

df["bookingInterval"] = df.groupby("userId")["bookingDate"].diff().dt.total_seconds()
df["bookingInterval"] = df["bookingInterval"].fillna(0)

le = LabelEncoder()
df["roomEncoded"] = le.fit_transform(df["room"].astype(str))
features = [
             "totalPrice",
             "totalGuestsNum",
             "bookingInterval",
             "refundAmount",
             "rewardDiscount", 
             "roomEncoded", 
             "advanceBookingDays",
             "nights"
            ]

scaled_features = scaler.fit_transform(df[features])
df_scaled = df.copy()

for i, f in enumerate(features):
  df_scaled[f] = scaled_features[:, i]

df_scaled["features"] = df_scaled[features].values.tolist()

def create_Sequence(user_df, seq_len=SEQ_LEN):
  values = user_df["features"].values
  sequences = []

  for i in range(len(values) - seq_len):
    sequences.append(values[i: i+seq_len])
  
  return np.array(sequences, dtype=np.float32)

def build_sequences(df, seq_len=SEQ_LEN):
  all_sequences = []
  indices = []
  for userId, group in df.groupby("userId"):
    values = group["features"].tolist()
    for i in range(len(values) - seq_len):
      all_sequences.append(values[i:i+seq_len])
      indices.append(group.index[i + seq_len])

  return np.array(all_sequences, dtype=np.float32), indices

x_train_seq, train_indices = build_sequences(df_scaled)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu") 

class BookingDataset(Dataset):
  def __init__(self, sequences):
    self.sequences = sequences

  def __len__(self):
    return len(self.sequences)

  def __getitem__(self, index) -> torch.Tensor:
    return torch.tensor(self.sequences[index], dtype=torch.float32)

  # Returns a descriptive string containing information such as the length of the dataset
  def __repr__(self) -> str:
    return f"BookingDataset with {self.__len__()} sequences"

dataset = BookingDataset(x_train_seq)
dataloader = DataLoader(dataset=dataset, batch_size=20, shuffle=True)

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
    # Encode
    _, (hidden, _) = self.encoder(x)
    # repeat hidden across time dimension
    hidden_repeated = hidden.repeat(self.seq_len, 1, 1).transpose(0, 1)
    # Decode
    decoded, _ = self.decoder(hidden_repeated)
    out = self.output_layer(decoded)
    return out
  
LSTMAutoencoderModel = LSTMAutoencoder(n_features=len(features), hidden_size=32, seq_len=5)
LSTMAutoencoderModel.to(device=device)

loss_fn = nn.MSELoss(reduction="mean")
optimizer = torch.optim.Adam(params=LSTMAutoencoderModel.parameters(), lr=0.01)

EPOCHS = 170
train_losses = []
for epoch in tqdm(range(EPOCHS)):
  LSTMAutoencoderModel.train()
  losses = []
  train_loss = []
  for batch in dataloader:
    batch = batch.to(device)
    output = LSTMAutoencoderModel(batch)
    loss = loss_fn(output, batch)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
    train_loss.append(loss.item())
  train_losses.append(np.mean(train_loss))

  if epoch % 5 == 0:
    print(f"Epoch {epoch}, loss: {train_losses[-1]:.4f}")

LSTMAutoencoderModel.eval()
with torch.inference_mode():
  X_tensor = torch.tensor(x_train_seq, dtype=torch.float32).to(device)
  reconstructions = LSTMAutoencoderModel(X_tensor)
  mse = torch.mean((X_tensor - reconstructions) ** 2, dim=(1,2)).detach().cpu().numpy()

torch.save(LSTMAutoencoderModel.state_dict(), "models/load_dict/anomaly-detection/bookings_anomaly_detection.pth")
threshold = np.mean(mse) + 2*np.std(mse)
anomalies_index = np.where(mse > threshold)[0]
print(f"threshold: {threshold}")
print(f"anomaly: {len(anomalies_index)}")

for i in anomalies_index:
  row_index = train_indices[i]
  row = df.loc[row_index]
  print(
          f"Index: {row.name}\t"
          f"bookingReference: {row['bookingReference']}\t"
          f"userId: {row['userId']}\t"
          f"userEmail: {row.get('userEmail','')}\t"
          f"guestId: {row.get('guestId','')}\t"
          f"userType: {row['userType']}\t"
          f"totalGuests: {row['totalGuests']}\t"
          f"totalPrice: {row['totalPrice']}\t"
          f"status: {row['status']}\t"
          f"paymentMethod: {row['paymentMethod']}\t"
          f"refundAmount: {row['refundAmount']}\t"
          f"rewardDiscount: {row['rewardDiscount']}\t"
          f"bookingDate: {row['bookingDate']}\t"
          f"bookingCreatedByUser: {row.get('bookingCreatedByUser','')}\t"
          f"advanceBookingDays: {row['advanceBookingDays']}\t"
          f"checkInDate: {row['checkInDate']}\t"
          f"checkOutDate: {row['checkOutDate']}"
      )
joblib.dump(threshold, "models/load_dict/anomaly-detection/threshold.pkl")
joblib.dump(scaler, "models/load_dict/anomaly-detection/scaler.pkl")
joblib.dump(le, "models/load_dict/anomaly-detection/label_encoder.pkl")