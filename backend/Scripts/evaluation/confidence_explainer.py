def explain_confidence(confidence, tier, reasoning_steps, final_answer):
    explanations = []

    if final_answer.lower() == "insufficient data":
        explanations.append(
            "The knowledge graph does not contain sufficient evidence to support an answer."
        )
        return explanations

    if confidence < 0.75:
        explanations.append(
            "The answer is supported by available knowledge but lacks strong or causal evidence."
        )

    if len(reasoning_steps) < 3:
        explanations.append(
            "The reasoning chain is shallow, reducing overall confidence."
        )

    if "," in final_answer:
        explanations.append(
            "Multiple entities are returned, indicating aggregation rather than a single definitive conclusion."
        )

    if not explanations:
        explanations.append(
            "The answer is strongly supported by retrieved knowledge and consistent reasoning."
        )

    return explanations
