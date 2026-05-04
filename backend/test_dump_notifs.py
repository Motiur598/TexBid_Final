import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    client = AsyncIOMotorClient(mongo_uri)
    db = client["texbid_db"]
    
    print("Notifications:")
    async for notif in db["notifications"].find().sort("created_at", -1).limit(5):
        print(f"Title: {notif.get('title')}, Link: {notif.get('link')}")

if __name__ == "__main__":
    asyncio.run(main())
