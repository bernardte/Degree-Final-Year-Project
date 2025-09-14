# config/mongoDB.py
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv, find_dotenv

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

__all__ = ["db", "mongo_client"]
