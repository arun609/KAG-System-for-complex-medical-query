# Scripts/reasoning/gemini_reasoner.py

import os
from google import genai
from config.api_keys import GEMINI_API_KEY
from Scripts.reasoning.utils import format_knowledge, parse_gemini_output


class GeminiReasoner:
    """
    LLM-based reasoning module.
    Uses Gemini to reason ONLY over retrieved KG facts.
    Includes quota-safe fallback to ensure system stability.
    """

    def __init__(self):
        if not GEMINI_API_KEY:
            raise ValueError("Gemini API key missing. Check config/api_keys.py")

        # Initialize Gemini client
        self.client = genai.Client(api_key=GEMINI_API_KEY)

        # Load prompt template safely
        base_dir = os.path.dirname(__file__)
        prompt_path = os.path.join(base_dir, "prompt_template.txt")

        if not os.path.exists(prompt_path):
            raise FileNotFoundError("prompt_template.txt not found in reasoning folder")

        with open(prompt_path, "r", encoding="utf-8") as f:
            self.prompt_template = f.read()

    def reason(self, retrieved_triples, query):
        """
        Performs reasoning over retrieved KG triples.

        Parameters:
        - retrieved_triples: list of (head, relation, tail)
        - query: original user query

        Returns:
        - dict with 'reasoning_steps' and 'final_answer'
        """

        knowledge_text = format_knowledge(retrieved_triples)

        prompt = self.prompt_template.format(
            knowledge=knowledge_text,
            question=query
        )

        try:
            # Call Gemini
            response = self.client.models.generate_content(
                model="gemini-2.5-flash-lite",
                contents=prompt,
                config={
                    "temperature": 0.2,
                    "max_output_tokens": 500
                }
            )

            output_text = response.text.strip()

            # Parse structured reasoning
            reasoning_steps, final_answer = parse_gemini_output(output_text)

        except Exception as e:
            # 🔒 SAFE FALLBACK (Quota exceeded / API failure / Network issues)
            reasoning_steps = [
                "Reasoning could not be generated due to temporary API limitations."
            ]
            final_answer = "Insufficient data"

        return {
            "reasoning_steps": reasoning_steps,
            "final_answer": final_answer
        }
