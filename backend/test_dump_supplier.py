import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    client = AsyncIOMotorClient(mongo_uri)
    db = client["texbid_db"]
    
    supplier = await db["users"].find_one({"id": "f58fe80b-979a-49ad-9dd1-1514d22bd953"})
    print("Supplier user:")
    print(supplier)

if __name__ == "__main__":
    asyncio.run(main())
