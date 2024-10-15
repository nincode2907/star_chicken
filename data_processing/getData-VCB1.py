import pdfplumber
import pandas as pd
import re
import gc
import time
from pymongo import MongoClient

import sys
sys.path.append('./pdf')

from mongo import connectionString, dbName, collectionName

date_pattern = r"(0[1-9]|10)/09/2024"
doc_no_pattern = r"\b\d{4}\.\d{5}\b"
amount_pattern = r"(\d{1,3})(\.\d{3})*\.000"

def extract_info_and_content(text):
    date = re.search(date_pattern, text)
    doc_no = re.search(doc_no_pattern, text)
    amount = re.search(amount_pattern, text)

    date = date.group(0) if date else ""
    doc_no = doc_no.group(0) if doc_no else ""
    amount = amount.group(0) if amount else ""

    content = text
    if date:
        content = content.replace(date, ' ', 1)
    if doc_no:
        content = content.replace(doc_no, ' ', 1)
    if amount:
        content = content.replace(amount, ' ', 1)
        amount = int(amount.replace('.', ''))
    
    return date, doc_no, amount, content.strip()

def extract_transactions(text):
    matches = list(re.finditer(date_pattern, text))  
    
    transactions = []
    
    for i in range(len(matches)):
        start = matches[i].start() 
        
        if i + 1 < len(matches):
            end = matches[i + 1].start()
        else:
            end = len(text)  
        
        transaction = text[start:end].strip()
        
        transactions.append(transaction)
    
    return transactions

def remove_footer(text):
    footer_pattern = r"Postal address:.*?Page \d+ of \d+"
    clean_text = re.sub(footer_pattern, '', text, flags=re.DOTALL) 
    return clean_text

def remove_header(text):
    header_pattern = "Số CT/ Doc No"  
    clean_text = text.split(header_pattern)[1]
    return clean_text

def get_data_to_excel(path):
    data = []
    dataframe = []
    count = 1
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            text = remove_footer(text)
            if (count == 1):
                text = remove_header(text)
            transactions = extract_transactions(text)
            for transaction in transactions:
                date, doc_no, amount, content = extract_info_and_content(transaction)
                dataframe.append({
                    "Date": date,
                    "Doc No": doc_no,
                    "Amount": amount,
                    "Content": content,
                    "Page": count
                })
            count += 1
        df = pd.DataFrame(dataframe)
        df.to_excel('output.xlsx', index=False)
    return df

def get_data_to_mongo(path, connection_string, db_name, collection_name):
    client = MongoClient(connection_string)
    db = client[db_name]
    collection = db[collection_name]
    
    dataframe = []
    count = 1
    total_page = 12048
    start_time = time.time()
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            page.close()
            text = remove_footer(text)
            if count == 1:
                text = remove_header(text)
            transactions = extract_transactions(text)
            for transaction in transactions:
                date, doc_no, amount, content = extract_info_and_content(transaction)
                dataframe.append({
                    "Date": date,
                    "Doc_No": doc_no,
                    "Amount": amount,
                    "Content": content,
                    "Page": count
                })
                
            if (count % 100 != 0):
                if dataframe:
                    result = collection.insert_many(dataframe)
                    dataframe = []
                    print(f"Inserted {len(result.inserted_ids)} documents into MongoDB")
                    print(f"Processed {count} pages out of {total_page}")
                    
                    elapsed_time = time.time() - start_time
                    elapsed_minutes = elapsed_time / 60 
                    print(f"Time elapsed: {elapsed_minutes:.2f} minutes...")
                    
                    gc.collect()
                else:
                    print("No data to insert")
            count += 1
            
    client.close()
    return dataframe

# get_data_to_mongo("1_10.pdf", connectionString, dbName, collectionName)