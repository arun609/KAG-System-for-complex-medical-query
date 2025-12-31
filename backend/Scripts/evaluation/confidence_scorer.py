def compute_confidence(retrieval_confidence, reasoning_steps, hop_count):
    """
    Computes confidence score based on:
    - Retrieval confidence
    - Reasoning depth (hop count)
    """

    score = retrieval_confidence

    # Penalize shallow or missing reasoning
    if not reasoning_steps or len(reasoning_steps) < 2:
        score -= 0.15

    # Reward true multi-hop reasoning
    if hop_count >= 3:
        score += 0.1

    # Clamp score
    score = max(0.0, min(1.0, score))

    return round(score, 2)
