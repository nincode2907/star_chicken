from pymongo import MongoClient
import re

date_pattern = r"(0[1-9]|10)/09/2024"

doc_no_pattern = r"\b\d{4}\.\d{5}\b"

amount_pattern = r"(\d{1,3})(\.\d{3})*\.000"

connection_string = "mongodb://localhost:27017/"
db_name = "checkVar"
collection_name = "Hearts"

# 
def extract_amount_from_content(content):
    # Tìm số đầu tiên trong chuỗi, có thể chứa dấu chấm
    match = re.match(r"(\d{1,3})(\.\d{3}){1,3}\b", content)
    if match:
        # Lấy phần số
        amount_str = match.group(0)
        # Loại bỏ dấu chấm và chuyển thành số nguyên
        amount = int(amount_str.replace('.', ''))
        # Cắt bỏ phần số đã trích xuất khỏi content
        new_content = content[len(amount_str):].strip()
        return amount, new_content
    return None, content

def update_amount_hearts_collection(connection_string, db_name, collection_name):
    client = MongoClient(connection_string)
    db = client[db_name]
    collection = db[collection_name]

    # Tìm tất cả document có Amount trống
    cursor = collection.find({"Amount": "", "Page": 5000})

    update_count = 0
    for doc in cursor:
        amount, new_content = extract_amount_from_content(doc['Content'])
        if amount is not None:
            # Cập nhật document
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

    # Tìm tất cả document có Amount trống
    cursor = collection.find({"Content": {"$regex": "\n"}, "Page": {"$gte": 9000,"$lte": 12048}})

    update_count = 0
    for doc in cursor:
        new_content = doc['Content'].replace("\n", " ")
        # Cập nhật document
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
    
    
replace_character_enter_in_content(connection_string, db_name, collection_name)


def extract_amount_from_content(content):
    # Tìm số đầu tiên trong chuỗi, có thể chứa dấu chấm
    match = re.match(r"(\d{1,3})(\.\d{3}){1,3}\b", content)
    if match:
        # Lấy phần số
        amount_str = match.group(0)
        # Loại bỏ dấu chấm và chuyển thành số nguyên
        amount = int(amount_str.replace('.', ''))
        # Cắt bỏ phần số đã trích xuất khỏi content
        new_content = content[len(amount_str):].strip()
        return amount, new_content
    return None, content

def update_amount_hearts_collection(connection_string, db_name, collection_name):
    client = MongoClient(connection_string)
    db = client[db_name]
    collection = db[collection_name]

    # Tìm tất cả document có Amount trống
    cursor = collection.find({"Amount": "", "Page": 5000})

    update_count = 0
    for doc in cursor:
        amount, new_content = extract_amount_from_content(doc['Content'])
        if amount is not None:
            # Cập nhật document
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