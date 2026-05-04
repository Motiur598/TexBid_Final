import os
import glob
import re

search_path = r"d:\TexBid_Final\backend\**\*.py"

for filepath in glob.glob(search_path, recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "mongodb://localhost:27017" in content and "os.getenv(\"MONGO_URI\"" not in content:
        print(f"Updating {filepath}")
        
        # Add import os if not present
        if "import os" not in content:
            content = "import os\n" + content
            
        # Replace client = AsyncIOMotorClient('mongodb://localhost:27017')
        # or client = AsyncIOMotorClient("mongodb://localhost:27017")
        pattern = r"client\s*=\s*AsyncIOMotorClient\(['\"]mongodb://localhost:27017['\"]\)"
        replacement = r"""mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    client = AsyncIOMotorClient(mongo_uri)"""
        
        new_content = re.sub(pattern, replacement, content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
print("Done!")
