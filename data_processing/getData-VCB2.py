import pandas as pd
from pymongo import MongoClient
from bson import ObjectId
from tqdm import tqdm
import itertools
import time
import gc
import pdfplumber

import sys
sys.path.append('./pdf')

from mongo import connectionString, dbName, collectionName, VCBObject12

excel_path= 'outputVCB12.xlsx'
source_pdf_path = "./pdf//sao-ke-Vietcombank-ngay-12-9.pdf"
source_id = VCBObject12

def spiner():
    spiner_cycle = itertools.cycle(['|', '/', '-', '\\'])
    while True:
        sys.stdout.write(next(spiner_cycle))
        sys.stdout.flush()
        time.sleep(0.1)
        sys.stdout.write("\b")

def get_data_to_excel(path, excel_path):
    dataframe = []
    count = 1
    start_time = time.time()
    with pdfplumber.open(path) as pdf:
        totalPages = len(pdf.pages)
        
        with tqdm(total=totalPages, desc="Processing pages", unit="page") as pbar:
            for page in pdf.pages:
                table = page.extract_table()
                page.close()
                if table is not None:
                    if count == 1:
                        table = table[1:]
                    for row in table:
                        if row[0] != None:
                            if row[0] == "Date":
                                continue
                            amount = int(row[2].replace('.', ''))
                            dataframe.append({
                                "Date": row[1],
                                "Doc_No": row[0],
                                "Amount": amount,
                                "Content": row[3].replace('"', ''),
                                "Page": count
                            }) 

                count += 1
                pbar.update(1)
    df = pd.DataFrame(dataframe)
    df.to_excel(excel_path, index=False)
    print("Completed 100%")
    elapsed_time = time.time() - start_time
    print("Elapsed time: ", elapsed_time / 60 , " minutes...")

def get_data_to_mongo(path):
    client = MongoClient(connectionString)
    db = client[dbName]
    collection = db[collectionName]
    
    dataframe = []
    count = 1
    start_time = time.time()
    with pdfplumber.open(path) as pdf:
        totalPages = len(pdf.pages)
        with tqdm(total=totalPages, desc="Processing pages", unit="page") as pbar:
            for page in pdf.pages:
                table = page.extract_table()
                page.close()
                if table is not None:
                    if count == 1:
                        table = table[1:]
                    for row in table:
                        if row[0] != None:
                            if row[0] == "Date":
                                continue
                            amount = int(row[2].replace('.', ''))
                            dataframe.append({
                                "Date": row[1],
                                "Doc_No": row[0],
                                "Amount": amount,
                                "Content": row[3].replace('"', ''),
                                "Page": count,
                                "Source": source_id
                            }) 

                if (count % 100 == 0):
                    if (dataframe):
                        collection.insert_many(dataframe)
                        dataframe = []
                        gc.collect()
                count += 1
                pbar.update(1)
                
    client.close()
    print("Completed 100%")
    elapsed_time = time.time() - start_time
    print("Elapsed time:", elapsed_time / 60 , "minutes...")
  
# using   
# get_data_to_excel(source_pdf_path, excel_path)
get_data_to_mongo(source_pdf_path)