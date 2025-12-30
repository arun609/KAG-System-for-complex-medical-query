def detect_intent(query: str) -> str:
    q = query.lower()

    if "gene" in q or "genes" in q:
        return "genes"
    if "pathway" in q:
        return "pathway"
    if "protein" in q and "interact" in q:
        return "protein_interaction"
    if "protein" in q:
        return "protein"
    if "treat" in q or "medicine" in q or "drug" in q:
        return "treatment"

    return "general"
