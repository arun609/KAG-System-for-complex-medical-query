import re
import pickle
import numpy as np
from sklearn.preprocessing import minmax_scale
from sklearn.metrics.pairwise import cosine_similarity

from .intent import detect_intent
from .retrieval_policy import RETRIEVAL_POLICY
from .validators import validate_evidence

import os

# ================= PATHS =================
# Get the "backend/" directory (2 levels up from Scripts/retrieval)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "data", "filtered")

CORPUS_FILE = os.path.join(DATA_DIR, "primekg_text_corpus_tagged.txt")
BM25_FILE   = os.path.join(DATA_DIR, "bm25.pkl")
EMB_FILE    = os.path.join(DATA_DIR, "embeddings.npy")
MODEL_FILE  = os.path.join(DATA_DIR, "embedding_model.pkl")
# =========================================

TOP_K = 5

GENERIC_TERMS = ["disease", "syndrome", "disorder", "cancer", "condition"]
BLACKLIST = [
    "central nervous system disease",
    "primary central nervous system lymphoma"
]

# ================= QUERY EXPANSION =================
QUERY_EXPANSION = {
     # ---------- Cardiovascular ----------
    "high blood pressure": "hypertension",
    "bp": "hypertension",
    "heart attack": "myocardial infarction",
    "cardiac arrest": "myocardial infarction",
    "chest pain": "angina pectoris",

    # ---------- Diabetes & Metabolism ----------
    "sugar": "diabetes mellitus",
    "sugar disease": "diabetes mellitus",
    "high sugar": "diabetes mellitus",
    "type 2 diabetes": "type 2 diabetes mellitus",
    "type 1 diabetes": "type 1 diabetes mellitus",
    "t2dm": "type 2 diabetes mellitus",
    "t1dm": "type 1 diabetes mellitus",

    # ---------- Neurological ----------
    "parkinson": "parkinson disease",
    "parkinson’s": "parkinson disease",
    "alzheimers": "alzheimer disease",
    "memory loss": "alzheimer disease",
    "epilepsy attack": "epilepsy",

    # ---------- Oncology ----------
    "blood cancer": "leukemia",
    "lung cancer": "lung carcinoma",
    "breast cancer": "breast carcinoma",

    # ---------- Respiratory ----------
    "breathing problem": "dyspnea",
    "breathing trouble": "dyspnea",
    "shortness of breath": "dyspnea",
    "asthma attack": "asthma",

    # ---------- Gastrointestinal ----------
    "stomach ulcer": "peptic ulcer disease",
    "acid reflux": "gastroesophageal reflux disease",
    "gerd": "gastroesophageal reflux disease",

    # ---------- Renal & Hepatic ----------
    "kidney failure": "renal failure",
    "liver failure": "hepatic failure",

    # ---------- Drugs (Common names → canonical) ----------
    "aspirin": "acetylsalicylic acid",
    "paracetamol": "acetaminophen",
    "tylenol": "acetaminophen",
    "blood thinner": "anticoagulant",
    "pain killer": "analgesic",

    # ---------- General phrasing ----------
    "medicine for": "treatment of",
    "drug for": "treatment of",
    "therapy for": "treatment of",
}

# ================= LOAD RESOURCES =================
with open(CORPUS_FILE, "r", encoding="utf-8") as f:
    corpus = f.read().splitlines()

with open(BM25_FILE, "rb") as f:
    bm25 = pickle.load(f)

embeddings = np.load(EMB_FILE)

# with open(MODEL_FILE, "rb") as f:
#     embed_model = pickle.load(f)
from sentence_transformers import SentenceTransformer
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

# ================= UTILITIES =================
def normalize(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^\w\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def expand_query(query: str) -> str:
    q_norm = normalize(query)
    for layman, clinical in QUERY_EXPANSION.items():
        if layman in q_norm:
            return query + " " + clinical
    return query


def extract_anchor_terms(query: str) -> list[str]:
    # Anchors are weak signals → never hard filters
    return [t for t in normalize(query).split() if len(t) > 4]


def generic_penalty(sentence: str) -> int:
    return sum(1 for t in GENERIC_TERMS if t in sentence.lower())


# ================= MAIN RETRIEVAL =================
def retrieve_knowledge(original_query: str) -> list[str]:
    """
    Intent-aware, policy-driven hybrid retrieval.
    Returns a list of PrimeKG sentences.
    """

    # ---- 1. Intent detection ----
    intent = detect_intent(original_query)
    policy = RETRIEVAL_POLICY.get(intent, RETRIEVAL_POLICY["general"])
    allowed_tags = policy["allowed_tags"]

    # ---- 2. Query normalization ----
    expanded_query = expand_query(original_query)
    q_norm = normalize(expanded_query)
    anchors = extract_anchor_terms(expanded_query)

    # ---- 3. Similarity scoring ----
    bm25_scores = bm25.get_scores(q_norm.split())
    query_embedding = embed_model.encode([q_norm])
    vec_scores = cosine_similarity(query_embedding, embeddings)[0]

    bm25_n = minmax_scale(bm25_scores)
    vec_n = minmax_scale(vec_scores)

    candidates = []

    # ---- 4. Candidate filtering (INTENT FIRST) ----
    for idx, sentence in enumerate(corpus):
        sent_l = sentence.lower()

        # (A) Relation-type constraint (CORE FIX)
        if allowed_tags:
            if not any(sentence.startswith(tag) for tag in allowed_tags):
                continue

        # (B) Blacklist
        if any(b in sent_l for b in BLACKLIST):
            continue

        # (C) Very weak similarity → skip
        if bm25_n[idx] < 0.15 and vec_n[idx] < 0.25:
            continue

        # (D) Anchor terms → SOFT signal, not blocker
        anchor_boost = 0.0
        if anchors and any(a in sent_l for a in anchors):
            anchor_boost = 0.1

        # ---- 5. Final score ----
        score = (
            0.45 * bm25_n[idx]
            + 0.45 * vec_n[idx]
            + anchor_boost
        )
        score -= 0.05 * generic_penalty(sentence)

        candidates.append((sentence, score))

    # ---- 6. Rank & deduplicate ----
    seen = set()
    ranked = []
    for s, sc in sorted(candidates, key=lambda x: x[1], reverse=True):
        if s not in seen:
            ranked.append(s)
            seen.add(s)
        if len(ranked) == TOP_K:
            break

    # ---- 7. Evidence validation (FINAL SAFETY GATE) ----
    if not validate_evidence(intent, ranked):
        return []

    return ranked
