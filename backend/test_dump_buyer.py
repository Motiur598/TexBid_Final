import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    client = AsyncIOMotorClient(mongo_uri)
    db = client["texbid_db"]
    
    buyer = await db["users"].find_one({"email": "buyer@texbid.com"})
    print(buyer)
    company = await db["companies"].find_one({"id": buyer.get("company_id")})
    print(company)

if __name__ == "__main__":
    asyncio.run(main())
