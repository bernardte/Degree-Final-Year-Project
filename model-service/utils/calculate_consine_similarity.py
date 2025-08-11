from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from langchain_community.embeddings import HuggingFaceEmbeddings

embeddings_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

def calculate_consine_similarity(query, retrieveText):
    print(f"query: {query}, retrieveText: {retrieveText}")
    query_vector = embeddings_model.embed_query(query)
    docs_vectors = embeddings_model.embed_query(retrieveText)
    similarity_scores = cosine_similarity(
        np.array([query_vector]),
        np.array([docs_vectors])
    )[0][0]  # Get the first score since we only have one query vector
    print("your similiarity %s: ", (similarity_scores))
    return similarity_scores