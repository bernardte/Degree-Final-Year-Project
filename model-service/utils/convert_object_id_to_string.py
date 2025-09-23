from bson import ObjectId

def clean_mongo_object(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, list):
        return [clean_mongo_object(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: clean_mongo_object(v) for k, v in obj.items()}
    return obj