import re

def format_knowledge(triples):
    """
    Converts a list of tuples into a readable string.
    Example: ("Drug", "treats", "Disease") -> "Drug treats Disease."
    """
    return "\n".join([f"{h} {r} {t}." for h, r, t in triples])

def parse_gemini_output(text):
    """
    Robustly parses the Gemini output to separate reasoning steps from the final answer.
    Handles bolding (**Final Answer:**) and case variations.
    """
    reasoning = []
    final_answer = "Answer not found in model output."

    # 1. Extract Final Answer using Regex
    # Matches "Final Answer" optionally surrounded by **, followed by a colon
    answer_match = re.search(r'(?:\*\*|)?Final Answer(?:\*\*|)?\s*:\s*(.*)', text, re.IGNORECASE | re.DOTALL)
    
    if answer_match:
        final_answer = answer_match.group(1).strip()
        # Process text BEFORE the answer for reasoning steps
        text_before_answer = text[:answer_match.start()]
    else:
        text_before_answer = text

    # 2. Extract Reasoning Steps
    lines = text_before_answer.split('\n')
    for line in lines:
        stripped = line.strip()
        # Skip headers
        if stripped.lower() in ["reasoning:", "reasoning steps:", "explanation:"]:
            continue
            
        # Match Numbered list (1. ...) OR Bullet points (- ..., * ...)
        if re.match(r'^(\d+\.|-|\*|•)\s+', stripped):
            reasoning.append(stripped)

    # Fallback: if no steps found via regex, just take non-empty lines from the reasoning text
    if not reasoning:
        reasoning = [
            line.strip() 
            for line in text_before_answer.split('\n') 
            if line.strip() and not line.strip().lower().startswith("reasoning")
        ]

    return reasoning, final_answer