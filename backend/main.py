# main.py
# Knowledge-Augmented Medical Query System API

import torch
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

# Internal modules
from Scripts.retrieval.hybrid_retrieval import retrieve_knowledge
from Scripts.reasoning.gemini_reasoner import GeminiReasoner
from Scripts.evaluation.confidence_scorer import compute_confidence
from Scripts.evaluation.evaluator import evaluator
import database

app = FastAPI(title="KAG Medical Query System", version="2.0")

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for dev; restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---
class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    password: str
    role: str = "student" # Default role

class QueryRequest(BaseModel):
    query: str
    user_id: Optional[int] = None # Optional for guest users

class HistoryResponse(BaseModel):
    query: str
    response: str
    timestamp: str

# --- Helper Functions ---
def sentence_to_triple(sentence):
    """
    Converts a retrieved PrimeKG sentence into a structured triple:
    (head, relation, tail)
    """
    sentence = sentence.strip()
    if sentence.startswith("["):
        sentence = sentence.split("]", 1)[1].strip()
    
    parts = sentence.split()
    if len(parts) < 3:
        return None
    
    head = parts[0]
    relation = parts[1].replace(" ", "_")
    tail = " ".join(parts[2:])
    return (head, relation, tail)

# --- Routes ---

@app.get("/")
def read_root():
    return {"status": "Online", "message": "KAG System Ready"}

@app.post("/login")
def login(request: LoginRequest):
    user = database.get_user(request.username, request.password)
    # user is (id, username, role)
    if user:
        return {"id": user[0], "username": user[1], "role": user[2], "status": "success"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/register")
def register(request: RegisterRequest):
    if database.add_user(request.username, request.password, request.role):
        return {"status": "created", "message": "User registered successfully"}
    raise HTTPException(status_code=400, detail="Username already exists")

@app.get("/history/{user_id}", response_model=List[HistoryResponse])
def get_user_history(user_id: int):
    history = database.get_history(user_id)
    return history

@app.post("/query")
def process_query(request: QueryRequest):
    query = request.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Empty query")

    # 1. Retrieval
    retrieval_result = retrieve_knowledge(query)
    
    if isinstance(retrieval_result, dict):
        facts = retrieval_result.get("facts", [])
        retrieval_confidence = retrieval_result.get("confidence", 0.7)
    else:
        facts = retrieval_result
        retrieval_confidence = 0.7

    # 2. Reasoning Preparation
    if not facts:
        response_text = "Insufficient data found in Knowledge Graph."
        final_response = {
            "final_answer": response_text,
            "confidence": 0.0,
            "explanation": "No relevant facts retrieved.",
            "reasoning_steps": []
        }
        if request.user_id:
            database.add_history(request.user_id, query, response_text)
        return final_response

    triples = []
    for fact in facts:
        triple = sentence_to_triple(fact)
        if triple:
            triples.append(triple)

    if not triples:
        response_text = "Data found but structured triples could not be formed."
        final_response = {
            "final_answer": response_text,
            "confidence": 0.0,
            "explanation": "Triples extraction failed.",
            "reasoning_steps": []
        }
        if request.user_id:
            database.add_history(request.user_id, query, response_text)
        return final_response

    # 3. Reasoning
    reasoner = GeminiReasoner()
    reasoning_output = reasoner.reason(triples, query)
    
    reasoning_steps = reasoning_output.get("reasoning_steps", [])
    final_answer = reasoning_output.get("final_answer", "Insufficient data")

    # 4. Evaluation
    hop_count = len(triples)
    confidence = compute_confidence(
        retrieval_confidence=retrieval_confidence,
        reasoning_steps=reasoning_steps,
        hop_count=hop_count
    )

    evaluation = evaluator(
        confidence=confidence,
        final_answer=final_answer,
        hop_count=hop_count
    )

    result = {
        "final_answer": final_answer,
        "reasoning_steps": reasoning_steps,
        "confidence_score": evaluation['confidence'],
        "confidence_tier": evaluation['tier'],
        "explanation": evaluation['explanation'],
        "retrieved_facts": facts,
        "structured_triples": triples
    }

    # 5. Save History
    if request.user_id:
        database.add_history(request.user_id, query, final_answer)

    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
