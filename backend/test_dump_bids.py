import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    client = AsyncIOMotorClient(mongo_uri)
    db = client["texbid_db"]
    
    rfq_id = "7985b314-a785-4aa6-a991-5102d561561f"
    print(f"Bids for {rfq_id}:")
    async for bid in db["bids"].find({"rfq_id": rfq_id}):
        print(f"ID: {bid.get('id')}, Supplier ID: {bid.get('supplier_id')}, Name: {bid.get('supplier_name')}")

if __name__ == "__main__":
    asyncio.run(main())
