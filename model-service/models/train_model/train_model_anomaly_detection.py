import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
import pandas as pd
from tqdm.auto import tqdm
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder
from pymongo import MongoClient
from config.mongoDB import db

# Connect to MongoDB
booking_collection = db["bookings"]

cursor = booking_collection.find({}, {
    "totalPrice": 1,
    "totalGuests.adults": 1,
    "totalGuests.children": 1,
    "breakfastIncluded": 1,
    "refundAmount": 1,
    "rewardDiscount": 1,
    "paymentMethod": 1,
    "status": 1
})

data = list(cursor)
df = pd.DataFrame(data)

print("original dataset: ")
print(df.head())

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

# missing value inserting 0
df = df.fillna(0)

# calculate total guest
df["guests"] = df["totalGuests"].apply(lambda x: (x.get("adults",0) + x.get("children",0)) if isinstance(x,dict) else 0)

# feature selection
numerical = df[["totalPrice", "guests", "breakfastIncluded", "refundAmount", "rewardDiscount"]].values

categorical = df[["paymentMethod", "status"]].astype(str).values

# one-hot encoder
encoder = OneHotEncoder(sparse_output=False, handle_unknown="ignore")
categorical_encoded = encoder.fit_transform(categorical)

# Merge
x = np.hstack([numerical, categorical_encoded])

# Normalization
scaler = MinMaxScaler()
X_scaler = scaler.fit_transform(x)

X_tensor = torch.tensor(X_scaler, dtype=torch.float32).to(device)
categorical_encoded_tensor = torch.tensor(categorical_encoded, dtype=torch.float32).to(device)

class Autoencoder(nn.Module):
  def __init__(self, input_shape, output_shape, hidden_units):
    super(Autoencoder, self).__init__()
    self.encoder = nn.Sequential(
        nn.Linear(input_shape, hidden_units),
        nn.ReLU(),
        nn.Linear(hidden_units, output_shape),
        nn.ReLU()
    )
    self.decoder = nn.Sequential(
      nn.Linear(output_shape, hidden_units),
      nn.ReLU(),
      nn.Linear(hidden_units, output_shape),
      nn.Sigmoid()
    )

  def forward(self, x):
    return self.decoder(self.encoder(x))
  
input_shape = X_tensor.shape[1]
output_shape = X_tensor.shape[1]
hidden_units = 16

model = Autoencoder(input_shape, output_shape, hidden_units)
model.to(device)


loss_fn = nn.MSELoss()
optimizer = optim.Adam(model.parameters(), lr=0.01)

NUM_EPOCHS  = 100
total_acc = 0
total_loss = 0

for epoch in tqdm (range(NUM_EPOCHS)):

  output = model(X_tensor)

  loss = loss_fn(output, X_tensor)

  optimizer.zero_grad()

  loss.backward()

  optimizer.step()

  total_loss += loss.item()

  if (epoch + 1) % 20 == 0:
    print(f"Epoch: {epoch}, Loss: {loss.item():.4f}")

torch.save(model.state_dict(), "models/load_dict/anomaly-detection/bookings_anomaly_detection.pth")

# Save the scaler and encoder (for new data detection)
import joblib
joblib.dump(scaler, "models/load_dict/anomaly-detection/scaler.pkl")
joblib.dump(encoder, "models/load_dict/anomaly-detection/categorical_encoder.pkl")

# evaluation model
model.eval()
with torch.inference_mode():
  reconstructed = model(X_tensor)
  mse = torch.mean((X_tensor - reconstructed) ** 2, dim=1).cpu()

threshold = (mse.mean() + 2 * mse.std()).item()
df["mse"] = mse.numpy()
df["is_anomaly"] = df["mse"] > threshold

print(df[["totalPrice", "guests", "paymentMethod", "status", "mse", "is_anomaly"]].head())