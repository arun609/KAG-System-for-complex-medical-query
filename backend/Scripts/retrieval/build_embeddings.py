import numpy as np
import pickle
from sentence_transformers import SentenceTransformer

# -------- PATHS --------
CORPUS_FILE = r"data/filtered/primekg_text_corpus_tagged.txt"
EMB_FILE    = r"data/filtered/embeddings.npy"
MODEL_FILE  = r"data/filtered/embedding_model.pkl"
# -----------------------

# load corpus
with open(CORPUS_FILE, "r", encoding="utf-8") as f:
    corpus = f.read().splitlines()

# load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# generate embeddings
embeddings = model.encode(
    corpus,
    show_progress_bar=True,
    batch_size=64
)

# save embeddings
np.save(EMB_FILE, embeddings)

# save model (optional but good practice)
with open(MODEL_FILE, "wb") as f:
    pickle.dump(model, f)

print("✅ Vector embeddings built and saved")
