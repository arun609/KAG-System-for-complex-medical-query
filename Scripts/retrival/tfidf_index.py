import pickle
from sklearn.feature_extraction.text import TfidfVectorizer

CORPUS_FILE = r"C:\Users\arunm\OneDrive\Documents\KAG system for complex medical query\data\filtered\primekg_text_corpus_tagged.txt"
MODEL_FILE = r"C:\Users\arunm\OneDrive\Documents\KAG system for complex medical query\data\filtered\tfidf_model.pkl"
VEC_FILE = r"C:\Users\arunm\OneDrive\Documents\KAG system for complex medical query\data\filtered\tfidf_vectors.pkl"

with open(CORPUS_FILE, "r", encoding="utf-8") as f:
    corpus = f.read().splitlines()

vectorizer = TfidfVectorizer(
    stop_words="english",
    max_features=50000
)

tfidf_vectors = vectorizer.fit_transform(corpus)

with open(MODEL_FILE, "wb") as f:
    pickle.dump(vectorizer, f)

with open(VEC_FILE, "wb") as f:
    pickle.dump(tfidf_vectors, f)

print("✅ TF-IDF index built successfully")
