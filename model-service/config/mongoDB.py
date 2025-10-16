# config/mongoDB.py
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv, find_dotenv
from pymongo import ASCENDING
import asyncio

dotenv_path = find_dotenv()
load_dotenv(dotenv_path)

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME")

if MONGODB_URI is None:
    raise RuntimeError("Environment variable MONGODB_URI is not set.")
if MONGODB_DB_NAME is None:
    raise RuntimeError("Environment variable MONGODB_DB_NAME is not set.")

mongo_client = AsyncIOMotorClient(MONGODB_URI)
db = mongo_client[MONGODB_DB_NAME]

async def ensure_ttl_index():
    try:
        await db["bookingsessions"].create_index(
            [("createdAt", ASCENDING)],
            expireAfterSeconds=1800  # 30 minitues expiry
        )
        print("✅ TTL index created for 'bookingsessions.createdAt' (30 mins expiry)")
    except Exception as e:
        print("⚠️ Failed to create TTL index:", e)

asyncio.get_event_loop().create_task(ensure_ttl_index())

__all__ = ["db", "mongo_client"]
