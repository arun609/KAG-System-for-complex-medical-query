RETRIEVAL_POLICY = {
    "treatment": {
        "allowed_tags": ["[indication]"],
        "strict": True
    },
    "genes": {
        "allowed_tags": ["[disease_protein]", "[gene_disease]"],
        "strict": True
    },
    "pathway": {
        "allowed_tags": ["[pathway_protein]"],
        "strict": True
    },
    "protein_interaction": {
        "allowed_tags": ["[protein_protein]"],
        "strict": True
    },
    "general": {
        "allowed_tags": None,
        "strict": False
    }
}
