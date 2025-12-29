import re
import pickle
import numpy as np
from sklearn.preprocessing import minmax_scale
from sklearn.metrics.pairwise import cosine_similarity

# ================= PATHS =================
CORPUS_FILE = "data/filtered/primekg_text_corpus_tagged.txt"
BM25_FILE   = "data/filtered/bm25.pkl"
EMB_FILE    = "data/filtered/embeddings.npy"
MODEL_FILE  = "data/filtered/embedding_model.pkl"
# =========================================

TOP_K = 5
HIGH_CONF = 0.80
LOW_CONF  = 0.50

GENERIC_TERMS = ["disease", "syndrome", "disorder", "cancer", "condition"]
BLACKLIST = [
    "central nervous system disease",
    "primary central nervous system lymphoma"
]

QUERY_EXPANSION = {
    "high blood pressure": "hypertension",
    "heart attack": "myocardial infarction",
    "stroke": "cerebrovascular accident",
    "sugar": "diabetes mellitus",
}

# ================= LOAD RESOURCES =================
with open(CORPUS_FILE, "r", encoding="utf-8") as f:
    corpus = f.read().splitlines()

with open(BM25_FILE, "rb") as f:
    bm25 = pickle.load(f)

embeddings = np.load(EMB_FILE)

with open(MODEL_FILE, "rb") as f:
    embed_model = pickle.load(f)

# ================= UTILITIES =================
def normalize(text):
    text = text.lower()
    text = re.sub(r"[^\w\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()

def expand_query(query):
    q_norm = normalize(query)
    for layman, clinical in QUERY_EXPANSION.items():
        if layman in q_norm:
            return query + " " + clinical
    return query

def extract_anchor_terms(query):
    return [t for t in normalize(query).split() if len(t) > 4]

def generic_penalty(sentence):
    return sum(1 for t in GENERIC_TERMS if t in sentence.lower())

# ================= MAIN RETRIEVAL FUNCTION =================
def retrieve_knowledge(user_query):
    expanded_query = expand_query(user_query)
    q_norm = normalize(expanded_query)
    anchors = extract_anchor_terms(expanded_query)

    bm25_scores = bm25.get_scores(q_norm.split())
    query_embedding = embed_model.encode([q_norm])
    vec_scores = cosine_similarity(query_embedding, embeddings)[0]

    bm25_n = minmax_scale(bm25_scores)
    vec_n = minmax_scale(vec_scores)

    candidates = []

    for idx, sentence in enumerate(corpus):
        sent_l = sentence.lower()

        if not any(a in sent_l for a in anchors):
            continue
        if any(b in sent_l for b in BLACKLIST):
            continue
        if bm25_n[idx] < 0.2 and vec_n[idx] < 0.3:
            continue

        score = 0.5 * bm25_n[idx] + 0.5 * vec_n[idx]
        score -= 0.05 * generic_penalty(sentence)

        candidates.append((sentence, score))

    ranked = sorted(candidates, key=lambda x: x[1], reverse=True)

    if not ranked:
        return []

    return [r[0] for r in ranked[:TOP_K]]
