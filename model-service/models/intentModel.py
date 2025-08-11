# model-service/intent_model.py
import torch
import numpy as np
import pickle
from torch import nn

# ----- Load encoders -----
with open("models/load_dict/vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

with open("models/load_dict/label_encoder.pkl", "rb") as f:
    label_encoder = pickle.load(f)

# ----- Model class -----
class IntentClassifier(nn.Module):
    def __init__(self, input_dim, output_dim, hidden_units=128):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden_units),
            nn.ReLU(),
            nn.Linear(hidden_units, hidden_units),
            nn.ReLU(),
            nn.Linear(hidden_units, output_dim)
        )
    def forward(self, x): 
        return self.net(x)

# ----- Load model -----
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
input_dim = len(vectorizer.get_feature_names_out())
output_dim = len(label_encoder.classes_)

model = IntentClassifier(input_dim, output_dim).to(device)
model.load_state_dict(torch.load("models/load_dict/intent_classifier.pth", map_location=device))
model.eval()

# ----- Prediction -----
def predict_intent(text: str) -> str:
    text_vector = vectorizer.transform([text])
    # Create a new copy data array if the array is not a same datatype then make it a new copy of numpy array
    dense_vector = np.asarray(text_vector.todense())
    text_tensor = torch.tensor(dense_vector, dtype=torch.float32).to(device)

    with torch.inference_mode():
        output = model(text_tensor)
        prediction_index = output.argmax(dim=1).item()
        return label_encoder.inverse_transform([prediction_index])[0]
