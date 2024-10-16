import pandas as pd
from pymongo import MongoClient
from bson import ObjectId
import re
import time
import pdfplumber
import gc

import sys
sys.path.append('./pdf')

from mongo import connectionString, dbName, collectionName, VietinBankObject

date_pattern = r"(10|11|12)/09/2024"
excel_path= 'outputVietinBank.xlsx'
source_pdf_path = "'./pdf/ung-ho-mttq-viet-nam-vietinbank.pdf'"
source_id = VietinBankObject

# from 10/09/2024 to 12/09/2024
def extract_date_from_time(time):
    date = re.search(date_pattern, time)
    return date.group(0) if date else ""

def get_data_to_excel(path, excel_path):
    dataframe = []
    count = 1
    start_time = time.time()
    with pdfplumber.open(path) as pdf:
        totalPages = pdf.pages
        for page in pdf.pages:
            table = page.extract_table()
            page.close()
            if table is not None:
                if count == 1:
                    table = table[2:]
                for row in table:
                    if row[0] != None:
                        if row[0] == "Date":
                            continue
                        date = extract_date_from_time(row[1])
                        amount = int(row[3].replace('.', ''))
                        dataframe.append({
                            "Date": date,
                            "Doc_No": row[0],
                            "Amount": amount,
                            "Content": row[2],
                            "Page": count
                        }) 

            if (count % 50 == 0):
                print("Page ", count, " done")
                print("Completed ", round((count / len(totalPages) * 100), 2), "%")
                elapsed_time = time.time() - start_time
                print("Elapsed time: ", elapsed_time / 60 , " minutes...")
            count += 1
        df = pd.DataFrame(dataframe)
        df.to_excel(excel_path, index=False)
    # return df

def get_data_to_mongo(path):
    client = MongoClient(connectionString)
    db = client[dbName]
    collection = db[collectionName]
    
    dataframe = []
    count = 1
    start_time = time.time()
    with pdfplumber.open(path) as pdf:
        totalPages = pdf.pages
        for page in pdf.pages:
            table = page.extract_table()
            page.close()
            if table is not None:
                if count == 1:
                    table = table[2:]
                for row in table:
                    if row[0] != None:
                        if row[0] == "Date":
                            continue
                        date = extract_date_from_time(row[1])
                        amount = int(row[3].replace('.', ''))
                        dataframe.append({
                            "Date": date,
                            "Doc_No": row[0],
                            "Amount": amount,
                            "Content": row[2],
                            "Page": count,
                            "Source": source
                        }) 

            if (count % 50 == 0):
                if (dataframe):
                    result = collection.insert_many(dataframe)
                    dataframe = []
                    print(f"Inserted {len(result.inserted_ids)} documents into MongoDB")
                    
                    print("Page ", count, " done")
                    print("Completed ", round((count / len(totalPages) * 100), 2), "%")
                    elapsed_time = time.time() - start_time
                    print("Elapsed time: ", elapsed_time / 60 , " minutes...")
                else:
                    print("No data to insert")
            count += 1
        df = pd.DataFrame(dataframe)
        client.close()
        print("Completed 100%")
  
  
# using   
# get_data_to_excel(source_pdf_path, excel_path)
# get_data_to_mongo(source_pdf_path)