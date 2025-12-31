

# 🧠 Knowledge-Augmented Generation (KAG) System for Complex Medical Query Answering

## 📌 Overview

This project implements a **Knowledge-Augmented Generation (KAG)** system designed to answer **complex medical queries** by combining **structured medical knowledge** from a **knowledge graph (PrimeKG)** with **LLM-based reasoning** using **Google Gemini**.

Unlike conventional LLM-based QA systems, this approach **separates knowledge retrieval from reasoning**, ensuring **grounded, explainable, and reliable medical answers**.

---

## 🎯 Key Objectives

* Enable **accurate medical question answering** using structured knowledge
* Prevent hallucinations by grounding responses in **PrimeKG facts**
* Provide **step-by-step explainable reasoning**
* Support **layman-to-clinical query understanding**
* Design a **modular, extensible architecture** suitable for research and academic evaluation

---

## 🧩 System Architecture

```
User Query
   ↓
Query Understanding
   ↓
Hybrid Knowledge Retrieval (BM25 + Embeddings)
   ↓
LLM-Based Reasoning (Google Gemini)
   ↓
Explainable Answer (Reasoning + Final Output)
```

---

## 🧠 Core Modules

### 1️⃣ Query Understanding

* Normalizes user input
* Expands layman terms to clinical terms
  *(e.g., “high blood pressure” → “hypertension”)*

---

### 2️⃣ Knowledge Retrieval

* Uses **hybrid retrieval**:

  * BM25 (lexical relevance)
  * Sentence embeddings (semantic similarity)
* Retrieves top-K relevant medical facts from **PrimeKG**
* Applies filtering using:

  * Intent detection
  * Anchor terms
  * Blacklists and generic penalties

---

### 3️⃣ Reasoning Module (LLM-Based)

* Uses **Google Gemini** via API
* Receives **only retrieved facts**, not raw user queries
* Performs:

  * Step-by-step logical reasoning
  * Multi-hop inference
* Outputs:

  * Reasoning steps
  * Final grounded answer

📌 The LLM **does not retrieve knowledge** — it only reasons over provided facts.

---

### 4️⃣ Pipeline Integration

* Connects retrieval and reasoning into an **end-to-end system**
* Accepts dynamic user input
* Removes all hard-coded or manual testing inputs

---

## 📁 Project Structure

```
KAG system for complex medical query/
│
├── data/
│   └── filtered/
│       ├── primekg_text_corpus_tagged.txt
│       ├── bm25.pkl
│       ├── embeddings.npy
│       └── embedding_model.pkl
│
├── Scripts/
│   ├── retrieval/
│   │   └── retriever.py
│   │
│   ├── reasoning/
│   │   ├── gemini_reasoner.py
│   │   ├── utils.py
│   │   └── prompt_template.txt
│   │
│   └── pipeline.py
│
└── README.md
```

---

## ⚙️ Technologies Used

* **Python 3.10+**
* **PrimeKG** (Medical Knowledge Graph)
* **BM25** (Lexical Retrieval)
* **Sentence Transformers** (Semantic Retrieval)
* **scikit-learn**
* **Google AI Studio (Gemini API)**
* **NumPy**

---

## 🔐 API Key Setup (Important)

This project uses **Google Gemini** via API.

### Set API Key as Environment Variable (Windows – PowerShell)

```powershell
setx GEMINI_API_KEY "YOUR_GEMINI_API_KEY"
```

Restart the terminal after setting the variable.

📌 **Never hardcode API keys** or commit them to GitHub.

---

## ▶️ How to Run the Project

From the **project root directory**:

```powershell
python Scripts/pipeline.py
```

Enter a medical query when prompted:

```
Enter your medical query: Treatment for heart attack?
```

---

## ✅ Example Output

```
--- Reasoning Steps ---
1. The question asks for a medication that treats hypertension and its mechanism.
2. Hypertension is treated by Ramipril.
3. Ramipril works through ACE inhibition.

--- Final Answer ---
Ramipril treats hypertension by ACE inhibition.
```

---

## 🧠 Why This Is Not “Just an LLM”

* The LLM **does not access external knowledge**
* All medical facts come from **PrimeKG**
* The LLM is used **only for reasoning**, not retrieval
* The system is:

  * Grounded
  * Explainable
  * Modular
  * Safer for medical use cases

---

## 🎓 Academic Relevance

This project demonstrates:

* Knowledge-Augmented Generation (KAG)
* Explainable AI (XAI)
* Multi-hop medical reasoning
* Responsible use of LLMs in healthcare

It is suitable for:

* Final-year projects
* Research demonstrations
* IEEE-style system papers

---

## 🚀 Future Enhancements

* Module 4: Confidence & Trust Scoring
* Streamlit-based web interface
* Support for additional PrimeKG relations
* Answer validation across multiple reasoning paths
* Deployment as a REST API (FastAPI)

---

## 👤 Author

**Arun M**
B.Tech – Artificial Intelligence & Data Science
Final Year Project

---

## 📜 License

This project is for **academic and research purposes only**.
Not intended for clinical or real-world medical decision-making.

---


