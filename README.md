
# 🧠 Medical KAG System

### Knowledge-Augmented Generation for Complex Medical Queries

---

## 📌 Overview

The **Medical KAG System** is a **prototype web application** that answers **complex medical queries** using a **Knowledge-Augmented Generation (KAG)** approach.
Unlike traditional LLM-based systems, this project integrates a **biomedical knowledge graph** with **LLM-based reasoning**, ensuring **grounded, explainable, and safe** responses.

This system is designed as a **research and educational prototype**, suitable for:

* Medical & biomedical students
* Researchers
* Clinical training professionals
* AI research demonstrations

> ⚠️ **Disclaimer:** This system is for educational and research purposes only. It does **not** provide clinical or medical advice.

---

## 🚀 Key Features

* 🔗 **Knowledge Graph–Driven Retrieval**
* 🧠 **LLM-Based Explainable Reasoning**
* 🔁 **Multi-hop Reasoning Support**
* 📊 **Confidence Scoring & Tiering**
* 🧾 **Explicit Evidence Triples (No Hallucination)**
* 🛑 **Safe Rejection for Unsupported Queries**
* 🌐 **Web-Based UI (Prototype)**

---

## 🧩 System Architecture

```
User Query
   ↓
Knowledge Graph Retrieval (PrimeKG-style)
   ↓
Structured Triples
   ↓
LLM Reasoning (Grounded)
   ↓
Final Answer
   ↓
Confidence Score + Tier
   ↓
Web UI Display
```

---

## 🛠️ Tech Stack

### Backend

* **Python**
* **FastAPI**
* **LLM (Gemini API)**
* **Knowledge Graph (PrimeKG-inspired dataset)**

### Frontend

* **React (Vite)**
* **Tailwind CSS**
* **Lucide Icons**
* **REST API Communication**

---

## 📂 Project Structure

```
KAG system for complex medical query/
│
├── backend/
│   ├── api.py
│   ├── main.py
│   ├── Scripts/
│   │   ├── retrieval/
│   │   ├── reasoning/
│   │   └── evaluation/
│   └── config/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## 🧪 Example Queries

### Tier-1 (Strongly Supported)

* **Which drug is indicated for ST-elevation myocardial infarction?**
* **What drugs are used to treat renal osteodystrophy?**
* **Which genes are associated with Parkinson disease?**

### Safe Rejection (Correct Behavior)

* **Which gene cures diabetes?**
* **What drug definitively cures cancer?**
* **Treatment for imaginary disease abcdef?**

---

## 📊 Confidence Tiering

| Tier       | Meaning                                 |
| ---------- | --------------------------------------- |
| **Tier 1** | Directly supported by explicit KG facts |
| **Tier 2** | Weak or aggregated support              |
| **Tier 3** | Not supported (Safe Rejection)          |

Each answer includes a **confidence explanation** describing *why* a tier was assigned.

---

## 🧠 Why KAG (Not Just RAG)?

| Feature             | RAG | KAG (This Project) |
| ------------------- | --- | ------------------ |
| Uses structured KG  | ❌   | ✅                  |
| Multi-hop reasoning | ❌   | ✅                  |
| Explainable answers | ❌   | ✅                  |
| Medical safety      | ⚠️  | ✅                  |
| Confidence scoring  | ❌   | ✅                  |

---

## 🧪 Prototype Status

✅ This project is **complete as a prototype**
✅ End-to-end system works
✅ Suitable for **academic review, demo, and GitHub submission**

---

## 🔮 Future Work (Optional)

* Integration with literature sources (PubMed)
* Expanded multi-hop KG reasoning
* Research vs Training mode switch
* Visualization of full KG subgraphs
* Deployment to cloud (AWS / GCP)

---

## 👨‍💻 Author

**Arun M**
B.Tech – Artificial Intelligence & Data Science

---

## 📜 License

This project is released for **academic and educational use only**.

---

