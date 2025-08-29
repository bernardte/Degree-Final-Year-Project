import json
import numpy as np
import pickle
import torch
import torch.nn as nn
from pymongo import MongoClient
from tqdm.auto import tqdm
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from torch.utils.data import DataLoader, Dataset
from config.mongoDB import db


# Connect to MongoDB
faq_collection = db["faqs"]

# Load data from MongoDB
data = list(faq_collection.find({"intent": {"$exists": True}}))  # 确保intent存在


texts = [item["question"] for item in data]
labels = [item["intent"] for item in data]

# device agnostic code
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

# 2. Text to vector
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(texts)

# 3. Encode labels
labels_encoder = LabelEncoder()
y = labels_encoder.fit_transform(labels)

# 4. Split the dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

class IntentDataset(Dataset):
    def __init__(self, X, y) -> None:
        self.X = torch.tensor(X.toarray(), dtype=torch.float)
        self.y = torch.tensor(y, dtype=torch.long)

    def __len__(self) -> int:
        return len(self.X)
    
    def __getitem__(self, index):
        return self.X[index], self.y[index]


class IntentClassifier(nn.Module):
    def __init__(self, input_shape, output_shape, hidden_units) -> None:
        super(IntentClassifier, self).__init__()
        self.net = nn.Sequential(
            nn.Linear(input_shape, hidden_units),
            nn.ReLU(),
            nn.Linear(hidden_units, hidden_units),
            nn.ReLU(),
            nn.Linear(hidden_units, output_shape)
        )
    def forward(self, X: torch.Tensor) -> torch.Tensor:
        return self.net(X)
    
def predict_intent(text: str) -> str:
    """
    Predict the intent of a given text.
    """
    model.eval()           
    with torch.inference_mode():
        # Convert text to vector
        text_vector = vectorizer.transform([text])
        dense_vector = np.asarray(text_vector.todense())  # safer than .toarray()
        text_tensor = torch.tensor(dense_vector, dtype=torch.float32).to(device)

        output = model(text_tensor)
        prediction_index = output.argmax(dim=1).item()
        return labels_encoder.inverse_transform([prediction_index])[0]

def accuracy(predictions: torch.Tensor, labels: torch.Tensor) -> float:
    correct = (predictions == labels).sum().item()
    total = labels.size(0)
    return correct / total


if __name__ == "__main__":

    train_dataset = IntentDataset(X_train, y_train)
    test_dataset = IntentDataset(X_test, y_test)

    train_loader = DataLoader(train_dataset,
                            batch_size=10,
                            shuffle=True,
                            num_workers=0
                            )

    test_loader = DataLoader(test_dataset,
                            batch_size=10,
                            shuffle=False,
                            num_workers=0)

    # 5. Initialize the model
    input_dim = X_train.shape[1]
    model = IntentClassifier(input_shape=input_dim,
                            output_shape=len(labels_encoder.classes_),
                            hidden_units=128).to(device)


    # 6. loss and optimizer
    optimizer = torch.optim.Adam(params=model.parameters(), 
                                lr=0.001)
    loss_fn = nn.CrossEntropyLoss()

    # Train the model
    NUM_EPOCHS = 40
    total_acc = 0
    total_loss = 0

    for epoch in  tqdm (range(NUM_EPOCHS)):
        model.train()

        for batch, (X, y) in enumerate(train_loader):

            # pass data to device
            X, y = X.to(device), y.to(device)

            # Step 1.Forward pass
            y_pred = model(X) # logits

            # Step 2. calculate loss and accuracy
            loss = loss_fn(y_pred, y)
            batch_accuracy = accuracy(y_pred.argmax(dim=1), y)

            # Step 3. optimizer zero grad
            optimizer.zero_grad()

            # Step 4. loss backward (backpropagation)
            loss.backward()

            # Step 5. optimizer step
            optimizer.step()

            
            total_acc += batch_accuracy
            total_loss += loss.item()

            if NUM_EPOCHS % 5 == 0:
                print(f"Epoch: {epoch+1}/{NUM_EPOCHS}, Batch: {batch}, Loss: {loss.item():.4f}, Accuracy: {batch_accuracy:.4f}")

        
    # 8. Test predictions
    test_samples = [
        "breakfast time?",
        "Bye, take care!",
        "Tell me something funny",
        "Book me a room for tomorrow"
    ]

    for sample in test_samples:
        intent = predict_intent(sample)
        print(f"{sample} → Intent: {intent}")

    
    torch.save(model.state_dict(), "models/load_dict/intent_classifier.pth")
    with open("models/load_dict/vectorizer.pkl", "wb") as f:
        pickle.dump(vectorizer, f)
    with open("models/load_dict/label_encoder.pkl", "wb") as f:
        pickle.dump(labels_encoder, f)

    print("Model, vectorizer, and label encoder saved.")


