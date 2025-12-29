import pickle
from rank_bm25 import BM25Okapi

# -------- PATHS --------
CORPUS_FILE = r"data/filtered/primekg_text_corpus_tagged.txt"
BM25_FILE   = r"data/filtered/bm25.pkl"
# -----------------------

# load corpus
with open(CORPUS_FILE, "r", encoding="utf-8") as f:
    corpus = f.read().splitlines()

# tokenize
tokenized_corpus = [doc.lower().split() for doc in corpus]

# build BM25 index
bm25 = BM25Okapi(tokenized_corpus)

# save index
with open(BM25_FILE, "wb") as f:
    pickle.dump(bm25, f)

print("✅ BM25 index built and saved")
