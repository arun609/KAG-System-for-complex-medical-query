from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ---- Import your existing pipeline modules ----
from Scripts.retrieval.hybrid_retrieval import retrieve_knowledge
from Scripts.reasoning.gemini_reasoner import GeminiReasoner
from Scripts.evaluation.confidence_scorer import compute_confidence
from Scripts.evaluation.evaluator import evaluator

# ---- FastAPI app ----
app = FastAPI(
    title="Medical KAG System API",
    description="Backend API for Knowledge-Augmented Medical Query System",
    version="1.0"
)

# ---- Enable CORS for frontend ----
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Request schema ----
class QueryRequest(BaseModel):
    query: str


# ---- Root endpoint ----
@app.get("/")
def health_check():
    return {"status": "Medical KAG backend running"}


# ---- Main query endpoint ----
@app.post("/query")
def run_query(request: QueryRequest):
    query = request.query.strip()

    if not query:
        return {
            "answer": "Insufficient data",
            "reasoning_steps": [],
            "confidence": 0.9,
            "tier": "Tier 3 – Not Supported (Safe Rejection)",
            "confidence_explanation": "Empty query received.",
            "entities": [],
            "evidenceUnits": []
        }

    # ============================
    # Module 2: Retrieval
    # ============================
    retrieval_result = retrieve_knowledge(query)

    # Support both list and dict returns
    if isinstance(retrieval_result, dict):
        facts = retrieval_result.get("facts", [])
        retrieval_conf = retrieval_result.get("confidence", 0.7)
    else:
        facts = retrieval_result
        retrieval_conf = 0.7

    # No facts → safe rejection
    if not facts:
        evaluation = evaluator(0.9, "Insufficient data", 0)

        return {
            "answer": "Insufficient data",
            "reasoning_steps": [],
            "confidence": evaluation["confidence"],
            "tier": evaluation["tier"],
            "confidence_explanation": "No relevant knowledge graph facts were retrieved.",
            "entities": [],
            "evidenceUnits": []
        }

    # ============================
    # Convert facts → triples
    # ============================
    triples = []
    for sentence in facts:
        sentence = sentence.strip()

        if sentence.startswith("["):
            sentence = sentence.split("]", 1)[1].strip()

        parts = sentence.split()
        if len(parts) >= 3:
            head = parts[0]
            relation = parts[1].replace(" ", "_")
            tail = " ".join(parts[2:])
            triples.append((head, relation, tail))

    if not triples:
        evaluation = evaluator(0.9, "Insufficient data", 0)

        return {
            "answer": "Insufficient data",
            "reasoning_steps": [],
            "confidence": evaluation["confidence"],
            "tier": evaluation["tier"],
            "confidence_explanation": "Knowledge could not be structured into triples.",
            "entities": [],
            "evidenceUnits": []
        }

    # ============================
    # Module 3: Reasoning
    # ============================
    reasoner = GeminiReasoner()
    reasoning_out = reasoner.reason(triples, query)

    reasoning_steps = reasoning_out.get("reasoning_steps", [])
    final_answer = reasoning_out.get("final_answer", "Insufficient data")

    # ============================
    # Module 4: Evaluation
    # ============================
    hop_count = len(reasoning_steps)

    confidence = compute_confidence(
        retrieval_confidence=retrieval_conf,
        reasoning_steps=reasoning_steps,
        hop_count=hop_count
    )

    evaluation = evaluator(confidence, final_answer, hop_count)

    # Confidence explanation (for UI)
    if evaluation["tier"].startswith("Tier 1"):
        explanation = (
            "The answer is directly supported by explicit multi-hop "
            "knowledge graph paths without speculative inference."
        )
    elif evaluation["tier"].startswith("Tier 2"):
        explanation = (
            "The answer is supported by retrieved knowledge, but relies on "
            "aggregation or weaker multi-hop inference."
        )
    else:
        explanation = (
            "The knowledge graph does not contain sufficient evidence "
            "to support an answer."
        )

    # ============================
    # Enhanced UI data
    # ============================
    # Extract entities from triples for UI
    entities = []
    seen_entities = set()
    entity_connections = {}
    
    # Count connections for each entity
    for head, rel, tail in triples:
        entity_connections[head] = entity_connections.get(head, 0) + 1
        entity_connections[tail] = entity_connections.get(tail, 0) + 1
    
    # Create entity objects
    for head, rel, tail in triples[:10]:  # Top 10 triples
        if head not in seen_entities:
            entities.append({
                "name": head,
                "type": "Entity",
                "connections": entity_connections.get(head, 1)
            })
            seen_entities.add(head)
        if tail not in seen_entities:
            entities.append({
                "name": tail,
                "type": "Entity", 
                "connections": entity_connections.get(tail, 1)
            })
            seen_entities.add(tail)
    
    # Format evidence units from triples
    evidenceUnits = [
        {
            "id": idx + 1,
            "head": head,
            "relation": relation,
            "tail": tail,
            "source": "PrimeKG",
            "support": min(0.95, confidence + 0.05)
        }
        for idx, (head, relation, tail) in enumerate(triples[:10])
    ]

    # ============================
    # Response to frontend
    # ============================
    return {
        "answer": final_answer,
        "reasoning_steps": reasoning_steps,
        "confidence": confidence,
        "tier": evaluation["tier"],
        "confidence_explanation": explanation,
        "entities": entities[:8],  # Top 8 entities
        "evidenceUnits": evidenceUnits  # Top 10 triples
    }