def validate_evidence(intent: str, sentences: list[str]) -> bool:
    if intent == "genes":
        return any("[disease_protein]" in s or "[gene_disease]" in s for s in sentences)

    if intent == "pathway":
        return any("[pathway_protein]" in s for s in sentences)

    if intent == "treatment":
        return any("[indication]" in s for s in sentences)

    return True
