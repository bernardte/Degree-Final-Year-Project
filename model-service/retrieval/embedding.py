from sentence_transformers import SentenceTransformer
from models import stream_llm

# Load the Sentence Transformer model once
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embedding(text):
    """
        Generating a sentences embedding for the given text
    """
    return model.encode(text).tolist()


