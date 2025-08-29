from config.mongoDB import db
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.schema import Document
from utils.calculate_consine_similarity import calculate_consine_similarity

# Global FAISS index
faiss_index = None
faiss_path = "./faiss_store"

# Use HuggingFaceEmbeddings for LangChain FAISS
embeddings_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

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
                documents.append(Document(page_content=f"Q:{q} \nA:{a}", metadata={"question": q, "answer": a}))
            else:
                print(f"[FAISS] Skipped invalid doc: {doc}")

        if not documents:
            print("[FAISS] No valid docs found.")
            return

        # Create FAISS index fr
        print(f"documents: {documents}")
        faiss_index = FAISS.from_documents(documents, embeddings_model)
        # let vector data to store in disk instead of memory, for better persistence, when the system close still available
        faiss_index.save_local(faiss_path)
        print(f"[FAISS] Loaded {len(documents)} documents into FAISS.")

    except Exception as e:
        print(f"[FAISS] Error loading data: {e}")
        faiss_index = None


def reload_faiss_index():
    global faiss_index
    try:
        faiss_index = FAISS.load_local(faiss_path, embeddings_model, allow_dangerous_deserialization=True)
        print("[FAISS] Reloaded index from disk.")
    except Exception as e:
        print(f"[FAISS] Failed to reload: {e}")



"""
    vector search
"""
# Use vector search to find the best matching questions.
async def find_best_faq(query):
    """
    Returns the best matching FAQ (if similarity > 0.8) or fallback.
    """
    global faiss_index
    if faiss_index is None:
        print("[FAISS] Index not available.")
        reload_faiss_index()
        return 0.0, {"question": "", "answer": ""}

    try:
        print(f"[FAISS] Query: {query}")
        print(f"[FAISS] faiss index2: {faiss_index}")
        result, distance = faiss_index.similarity_search_with_score(query, k=1)[0]

        if not result:
            return 0.0, {"question": "", "answer": ""}

        # calculate similarity score by using cosine similarity
        score = calculate_consine_similarity(query, result.metadata["question"]) 
        print(f"[FAISS] Score: {score}")
        return (score, result.metadata)

    except Exception as e:
        print(f"[FAISS] Error during search: {e}")
        return 0.0, {"question": "", "answer": ""}
