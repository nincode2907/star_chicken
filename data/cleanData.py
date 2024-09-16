from pymongo import MongoClient
import re

date_pattern = r"(0[1-9]|10)/09/2024"

doc_no_pattern = r"\b\d{4}\.\d{5}\b"
doc_no_pattern2 = r"\b\d{4}\.\d{4}\b"
doc_no_pattern3 = r"\b\d{4}\.\d{3}\b"
doc_no_pattern4 = r"\b\d{4}\.\d{2}\b"
doc_no_pattern5 = r"\b\d{4}\.\d{1}\b"

amount_pattern = r"(\d{1,3})(\.\d{3})*\.000"

connection_string = "mongodb+srv://services2907:dQQ5nRk2w8UbtA2L@cluster0.eyewh.mongodb.net/"
db_name = "checkVar"
collection_name = "Hearts"

# 
def extract_amount_from_content(content):
    match = re.match(r"(\d{1,3})(\.\d{3}){1,3}\b", content)
    if match:
        amount_str = match.group(0)
        amount = int(amount_str.replace('.', ''))
        new_content = content[len(amount_str):].strip()
        return amount, new_content
    return None, content

def update_amount_hearts_collection(connection_string, db_name, collection_name):
    client = MongoClient(connection_string)
    db = client[db_name]
    collection = db[collection_name]

    cursor = collection.find({"Amount": "", "Page": 5000})

    update_count = 0
    for doc in cursor:
        amount, new_content = extract_amount_from_content(doc['Content'])
        if amount is not None:
            result = collection.update_one(
                {"_id": doc['_id']},
                {
                    "$set": {
                        "Amount": amount,
                        "Content": new_content
                    }
                }
            )
            if result.modified_count > 0:
                update_count += 1

    print(f"Đã cập nhật {update_count} document.")
    client.close()


# update_amount_hearts_collection(connection_string, db_name, collection_name)

def replace_character_enter_in_content(connection_string, db_name, collection_name):
    client = MongoClient(connection_string)
    db = client[db_name]
    collection = db[collection_name]

    cursor = collection.find({"Content": {"$regex": "\n"}, "Page": {"$gte": 9000,"$lte": 12048}})

    update_count = 0
    for doc in cursor:
        new_content = doc['Content'].replace("\n", " ")
        result = collection.update_one(
            {"_id": doc['_id']},
            {
                "$set": {
                    "Content": new_content
                }
            }
        )
        if result.modified_count > 0:
            update_count += 1

    print(f"Đã cập nhật {update_count} document.")
    client.close()
    
    
# replace_character_enter_in_content(connection_string, db_name, collection_name)


def extract_amount_from_content(content):
    match = re.match(r"(\d{1,3})(\.\d{3}){1,3}\b", content)
    if match:
        amount_str = match.group(0)
        amount = int(amount_str.replace('.', ''))
        new_content = content[len(amount_str):].strip()
        return amount, new_content
    return None, content

def update_amount_hearts_collection(connection_string, db_name, collection_name):
    client = MongoClient(connection_string)
    db = client[db_name]
    collection = db[collection_name]

    cursor = collection.find({"Amount": "", "Page": 5000})

    update_count = 0
    for doc in cursor:
        amount, new_content = extract_amount_from_content(doc['Content'])
        if amount is not None:
            result = collection.update_one(
                {"_id": doc['_id']},
                {
                    "$set": {
                        "Amount": amount,
                        "Content": new_content
                    }
                }
            )
            if result.modified_count > 0:
                update_count += 1

    print(f"Đã cập nhật {update_count} document.")
    client.close()

# update_amount_hearts_collection(connection_string, db_name, collection_name)

def update_docno_hearts_collection(connection_string, db_name, collection_name):
    client = MongoClient(connection_string)
    db = client[db_name]
    collection = db[collection_name]
    
    cursor = collection.find({"Doc_No": ""})

    update_count = 0
    for doc in cursor:
        # Tìm DocNo trong Content options (doc_no_pattern, doc_no_pattern2, doc_no_pattern3, doc_no_pattern4)
        match = re.search(doc_no_pattern5, doc['Content'])
        if match:
            doc_no = match.group(0)
            new_content = doc['Content'].replace(doc_no, "").strip()
            result = collection.update_one(
                {"_id": doc['_id']},
                {
                    "$set": {
                        "Doc_No": doc_no,
                        "Content": new_content
                    }
                }
            )
            if result.modified_count > 0:
                update_count += 1

    print(f"Đã cập nhật {update_count} document.")
    client.close()
    
# update_docno_hearts_collection(connection_string, db_name, collection_name)