from gemini_reasoner import GeminiReasoner

# Mock Data
retrieved_triples = [
    ("Hypertension", "treated_by", "Ramipril"),
    ("Ramipril", "mechanism", "ACE inhibition")
]

query = "What medication treats hypertension and how?"

# Initialize and Run
try:
    reasoner = GeminiReasoner()
    result = reasoner.reason(retrieved_triples, query)

    print("\n--- Reasoning Steps ---")
    for step in result["reasoning_steps"]:
        print(step)

    print("\n--- Final Answer ---")
    print(result["final_answer"])

except Exception as e:
    print(f"Error occurred: {e}")