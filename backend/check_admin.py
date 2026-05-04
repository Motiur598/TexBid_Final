import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

import os

async def main():
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    client = AsyncIOMotorClient(mongo_uri)
    db = client.texbid_db
    admins = await db.users.find({'is_admin': True}).to_list(None)
    if admins:
        print('Admins found:')
        for a in admins:
            print(f"- {a.get('email')}")
    else:
        print('No admins found in DB.')

asyncio.run(main())
