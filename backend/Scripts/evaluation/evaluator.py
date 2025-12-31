def evaluator(confidence, final_answer, hop_count):
    """
    Assigns evaluation tier based on:
    - Confidence score
    - Answer validity
    - Explicit multi-hop support
    """

    has_answer = (
        final_answer
        and final_answer.strip() != ""
        and final_answer.lower() != "insufficient data"
    )

    if not has_answer:
        tier = "Tier 3 – Not Supported (Safe Rejection)"

    elif confidence >= 0.8:
        tier = "Tier 1 – Answer Supported"

    elif confidence >= 0.6:
        tier = "Tier 2 – Weakly Supported"

    else:
        tier = "Tier 3 – Not Supported (Safe Rejection)"

    # 🧠 Explanation logic
    if tier == "Tier 1 – Answer Supported":
        explanation = (
            "The answer is supported by explicit knowledge graph facts."
            if hop_count <= 1 else
            "The answer is supported by an explicit multi-hop knowledge graph path."
        )

    elif tier == "Tier 2 – Weakly Supported":
        explanation = (
            "The answer is supported but relies on aggregation or limited inference."
        )

    else:
        explanation = (
            "The knowledge graph does not contain sufficient evidence to support an answer."
        )

    return {
        "confidence": confidence,
        "tier": tier,
        "explanation": explanation
    }
