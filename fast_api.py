from fastapi import FastAPI, HTTPException

app = FastAPI()

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


