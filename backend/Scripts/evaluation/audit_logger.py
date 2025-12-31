import json
import os
from datetime import datetime

LOG_FILE = "logs/audit_log.jsonl"


def log_run(query, retrieved_facts, reasoning_steps, final_answer, confidence, tier):
    os.makedirs("logs", exist_ok=True)

    record = {
        "timestamp": datetime.utcnow().isoformat(),
        "query": query,
        "retrieved_facts": retrieved_facts,
        "reasoning_steps": reasoning_steps,
        "final_answer": final_answer,
        "confidence": confidence,
        "tier": tier
    }

    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(record) + "\n")
