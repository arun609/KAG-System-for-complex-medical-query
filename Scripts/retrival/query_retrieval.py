import pickle
from sklearn.metrics.pairwise import cosine_similarity

CORPUS_FILE = r"C:\Users\arunm\OneDrive\Documents\KAG system for complex medical query\data\filtered\primekg_text_corpus_tagged.txt"
MODEL_FILE = r"C:\Users\arunm\OneDrive\Documents\KAG system for complex medical query\data\filtered\tfidf_model.pkl"
VEC_FILE = r"C:\Users\arunm\OneDrive\Documents\KAG system for complex medical query\data\filtered\tfidf_vectors.pkl"

with open(CORPUS_FILE, "r", encoding="utf-8") as f:
    corpus = f.read().splitlines()

with open(MODEL_FILE, "rb") as f:
    vectorizer = pickle.load(f)

with open(VEC_FILE, "rb") as f:
    tfidf_vectors = pickle.load(f)

# ---------- INFER RELATION ----------
def infer_allowed_relation(query):
    q = query.lower()
    if "drug" in q or "treat" in q or "therapy" in q:
        return "[indication]"
    if "gene" in q or "associated" in q:
        return "[disease_protein]"
    if "interact" in q:
        return "[protein_protein]"
    if "pathway" in q:
        return "[pathway_protein]"
    if "related disease" in q:
        return "[disease_disease]"
    return None

# ---------- RETRIEVE ----------
def retrieve(query, top_k=5):
    query_vec = vectorizer.transform([query])
    scores = cosine_similarity(query_vec, tfidf_vectors)[0]
    ranked_indices = scores.argsort()[::-1]

    allowed_tag = infer_allowed_relation(query)

    results = []
    seen = set()

    for i in ranked_indices:
        sentence = corpus[i]
        if allowed_tag is None or sentence.startswith(allowed_tag):
            if sentence not in seen:
                results.append(sentence)
                seen.add(sentence)
        if len(results) == top_k:
            break

    return results

# ---------- TEST ----------
query = "Type 1 Diabetes"
results = retrieve(query, top_k=5)

print("\nQuery:", query)
print("\nTop retrieved knowledge:")
for r in results:
    print("-", r)