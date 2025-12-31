# main.py
# Entry point for Knowledge-Augmented Medical Query System

from Scripts.retrieval.hybrid_retrieval import retrieve_knowledge
from Scripts.reasoning.gemini_reasoner import GeminiReasoner
from Scripts.evaluation.confidence_scorer import compute_confidence
from Scripts.evaluation.evaluator import evaluator


def sentence_to_triple(sentence):
    """
    Converts a retrieved PrimeKG sentence into a structured triple:
    (head, relation, tail)

    Example:
    '[indication] Drug Clopidogrel is indicated for disease ST-elevation myocardial infarction'
    → ('Clopidogrel', 'indicated_for', 'ST-elevation myocardial infarction')
    """

    sentence = sentence.strip()

    # Remove KG tag if present
    if sentence.startswith("["):
        sentence = sentence.split("]", 1)[1].strip()

    parts = sentence.split()
    if len(parts) < 3:
        return None

    head = parts[0]
    relation = parts[1].replace(" ", "_")
    tail = " ".join(parts[2:])

    return (head, relation, tail)


def main():
    print("\n=== Knowledge-Augmented Medical Query System ===\n")

    query = input("Enter your medical query: ").strip()
    if not query:
        print("Empty query provided.")
        return

    # ===============================
    # Module 2: Knowledge Retrieval
    # ===============================
    retrieval_result = retrieve_knowledge(query)

    # Handle both dict-based and list-based retrievers
    if isinstance(retrieval_result, dict):
        facts = retrieval_result.get("facts", [])
        retrieval_confidence = retrieval_result.get("confidence", 0.7)
    else:
        facts = retrieval_result
        retrieval_confidence = 0.7  # conservative default

    # ---------- No KG Evidence ----------
    if not facts:
        evaluation = evaluator(
            confidence=0.9,
            final_answer="Insufficient data",
            hop_count=0
        )

        print("\n--- Final Answer ---")
        print("Insufficient data")

        print("\n--- Confidence Assessment ---")
        print(f"Score: {evaluation['confidence']}")
        print(f"Tier: {evaluation['tier']}")
        print("\n--- Confidence Explanation ---")
        print(f"- {evaluation['explanation']}")
        return

    # ===============================
    # Convert KG facts → triples
    # ===============================
    triples = []
    for fact in facts:
        triple = sentence_to_triple(fact)
        if triple:
            triples.append(triple)

    if not triples:
        evaluation = evaluator(
            confidence=0.85,
            final_answer="Insufficient data",
            hop_count=0
        )

        print("\n--- Final Answer ---")
        print("Insufficient data")

        print("\n--- Confidence Assessment ---")
        print(f"Score: {evaluation['confidence']}")
        print(f"Tier: {evaluation['tier']}")
        print("\n--- Confidence Explanation ---")
        print(f"- {evaluation['explanation']}")
        return

    # ===============================
    # Module 3: LLM-Based Reasoning
    # ===============================
    reasoner = GeminiReasoner()
    reasoning_output = reasoner.reason(triples, query)

    reasoning_steps = reasoning_output.get("reasoning_steps", [])
    final_answer = reasoning_output.get("final_answer", "Insufficient data")

    # ===============================
    # Module 4: Evaluation & Confidence
    # ===============================
    hop_count = len(triples)  # explicit KG hops used

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

    # ===============================
    # Output
    # ===============================
    print("\n--- Reasoning Steps ---")
    for step in reasoning_steps:
        print(step)

    print("\n--- Final Answer ---")
    print(final_answer)

    print("\n--- Confidence Assessment ---")
    print(f"Score: {evaluation['confidence']}")
    print(f"Tier: {evaluation['tier']}")

    print("\n--- Confidence Explanation ---")
    print(f"- {evaluation['explanation']}")


if __name__ == "__main__":
    main()
