from Scripts.retrieval.hybrid_retrieval import retrieve_knowledge
from Scripts.reasoning.gemini_reasoner import GeminiReasoner


def sentence_to_triple(sentence):
    """
    Converts a PrimeKG sentence into (head, relation, tail)
    Example:
    '[indication] Hypertension treated by Ramipril'
    → ('Hypertension', 'treated_by', 'Ramipril')
    """
    # Remove tag if present
    sentence = sentence.strip()
    if sentence.startswith("["):
        sentence = sentence.split("]", 1)[1].strip()

    parts = sentence.split()

    # Basic heuristic: first word = head, second = relation, rest = tail
    if len(parts) < 3:
        return None

    head = parts[0]
    relation = parts[1].replace(" ", "_")
    tail = " ".join(parts[2:])

    return (head, relation, tail)


def main():
    query = input("Enter your medical query: ")

    retrieved_sentences = retrieve_knowledge(query)

    if not retrieved_sentences:
        print("No relevant medical knowledge found.")
        return

    triples = []
    for s in retrieved_sentences:
        triple = sentence_to_triple(s)
        if triple:
            triples.append(triple)

    if not triples:
        print("Could not extract structured knowledge.")
        return

    reasoner = GeminiReasoner()
    result = reasoner.reason(triples, query)

    print("\n--- Reasoning Steps ---")
    for step in result["reasoning_steps"]:
        print(step)

    print("\n--- Final Answer ---")
    print(result["final_answer"])


if __name__ == "__main__":
    main()
