import os
from google import genai
from utils import format_knowledge, parse_gemini_output

class GeminiReasoner:
    def __init__(self):
        # Ensure your environment variable GEMINI_API_KEY is set
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set.")

        self.client = genai.Client(api_key=api_key)

        base_dir = os.path.dirname(__file__)
        prompt_path = os.path.join(base_dir, "prompt_template.txt")

        # Load the prompt template
        with open(prompt_path, "r", encoding="utf-8") as f:
            self.prompt_template = f.read()

    def reason(self, retrieved_triples, query):
        knowledge_text = format_knowledge(retrieved_triples)

        prompt = self.prompt_template.format(
            knowledge=knowledge_text,
            question=query
        )

        # Using gemini-2.5-flash-lite for higher rate limits
        response = self.client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt,
            config={
                "temperature": 0.2,
                "max_output_tokens": 500
            }
        )

        output_text = response.text
        
        # Optional: Print raw output for debugging if needed
        # print(f"\n[DEBUG] Raw Model Output:\n{output_text}\n")

        reasoning, answer = parse_gemini_output(output_text)

        return {
            "reasoning_steps": reasoning,
            "final_answer": answer
        }