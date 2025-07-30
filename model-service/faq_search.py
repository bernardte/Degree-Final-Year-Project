from sentence_transformers import SentenceTransformer
from config.mongoDB import db
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.schema import Document

# Global FAISS index
faiss_index = None
faiss_path = "./faiss_store"

# Use HuggingFaceEmbeddings for LangChain FAISS
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Load FAQ data and store it into a vector database (such as FAISS).
def load_faqs_from_mongodb(db_instance):
    """
    Load FAQ documents from MongoDB and embed only the question.
    """
    global faiss_index
    print('[FAISS] Loading FAQs from MongoDB...')

    try:
        faqs_collection = db_instance["faqs"]
        docs = faqs_collection.find({})
        documents = []

        for doc in docs:
            if "question" in doc and "answer" in doc:
                q = doc["question"]
                a = doc["answer"]
                documents.append(Document(page_content=q, metadata={"question": q, "answer": a}))
            else:
                print(f"[FAISS] Skipped invalid doc: {doc}")

        if not documents:
            print("[FAISS] No valid docs found.")
            return

        faiss_index = FAISS.from_documents(documents, embedding_model)
        # let vector data to store in disk instead of memory, for better persistence, when the system close still available
        faiss_index.save_local(faiss_path)
        print(f"[FAISS] Loaded {len(documents)} documents into FAISS.")

    except Exception as e:
        print(f"[FAISS] Error loading data: {e}")
        faiss_index = None


"""
    vector search
"""
# Use vector search to find the best matching questions.
def find_best_faq(query):
    """
    Returns the best matching FAQ (if similarity > 0.8) or fallback.
    """
    global faiss_index
    if faiss_index is None:
        print("[FAISS] Index not available.")
        return 0.0, {"question": "", "answer": ""}

    try:
        print(f"[FAISS] Query: {query}")
        result, distance = faiss_index.similarity_search_with_score(query, k=1)[0]

        if not result:
            return 0.0, {"question": "", "answer": ""}

        score = 1 - distance
        print(f"[FAISS] Score: {score}")
        return (score, result.metadata)

    except Exception as e:
        print(f"[FAISS] Error during search: {e}")
        return 0.0, {"question": "", "answer": ""}
