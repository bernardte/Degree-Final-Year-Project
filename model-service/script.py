from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
import json
from config.mongoDB import db, mongo_client

# Load Sentence Transformer model
model = SentenceTransformer("all-MiniLM-L6-v2")

FAQ_COLLECTION  = "faqs"

# sample FAQ data (replace with your actual faqs.json content)

sample_faqs = [
    {"question": "What is the check-out time of the hotel?", "answer": "Our hotel's check-out time is 3pm. If you need a late check-out, please contact the front desk."},
    {"question": "What is the breakfast time?", "answer": "Breakfast is served from 7am to 10am."},
    {"question": "Does the hotel provide free parking?", "answer": "Yes, we provide free underground parking for guests."},
    {"question": "How to book a room?", "answer": "You can book a room through our official website, phone or third-party booking platforms."},
    {"question": "Does the hotel have a gym?", "answer": "Yes, our hotel has a 24-hour gym, which is free for all guests."},
    {"question": "Can pets be brought in?", "answer": "Sorry, pets are not allowed in our hotel."},
    {"question": "Does the hotel provide laundry service?", "answer": "Yes, we provide self-service laundry and laundry delivery services. Please contact the front desk for details."}
]

def insert_faqs_with_embeddings():
    faqs_collection = db[FAQ_COLLECTION]

    # clear existing FAQs for a clean and start
    faqs_collection.delete_many({})
    print('Cleared existing FAQs in MongoDB')

    faqs_to_insert = []
    for faq in sample_faqs:
        question_embedding = model.encode(faq['question']).tolist()
        faqs_to_insert.append({
            "question": faq['question'],
            "answer": faq['answer'],
            "question_embedding": question_embedding
        })

    if faqs_to_insert:
        faqs_collection.insert_many(faqs_to_insert)
        print(f'Inserted {len(faqs_to_insert)} FAQs with embeddings into MongoDB.')
    else:
        print("No FAQs to insert. ")
    
    mongo_client.close()

if __name__ == "__main__":
    insert_faqs_with_embeddings()