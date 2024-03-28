import json
import random
import os
from fastapi import FastAPI, HTTPException

app = FastAPI()

# Create a json to make book entries persist.. when a new book is entered, write it onto json file to keep even after restarting app
BOOKS_FILE = "books.json"
if os.path.exists(BOOKS_FILE):
    with open(BOOKS_FILE, "r") as f:
      BOOK_DATABASE = json.load(f)

BOOK_DATABASE = [
    "The Great Gatsby",
    "Atomic Habits",
    "Moonwalking with Einstein"
]

@app.get("/")
async def root():
    return {"statusCode": 200, "body": "Welcome to the bookstore!"}

@app.get("/list-books")
async def list_books():
    return {"Books": BOOK_DATABASE}

# book by index
@app.get("/book-by-index/{index}")
async def book_by_index(index: int):
    if index < 0 or index >= len(BOOK_DATABASE):
      # Fail
      raise HTTPException(404, f"Index {index} is out of range {len(BOOK_DATABASE)}.")
    else:
      return {"book": BOOK_DATABASE[index]}

@app.get("/get-random-book")
async def get_random_book():
    return random.choice(BOOK_DATABASE)

@app.post("/add-book")
async def add_book(book: str):
    BOOK_DATABASE.append(book)
    with open(BOOKS_FILE, "w") as f:
      json.dump(BOOK_DATABASE, f)
    return {"message": f"Book {book} was added."}

@app.post("")
