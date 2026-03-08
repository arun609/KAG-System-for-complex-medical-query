
import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from config.api_keys import GEMINI_API_KEY
from google import genai

print(f"Testing Gemini API with key: {GEMINI_API_KEY[:5]}...{GEMINI_API_KEY[-5:]}")

client = genai.Client(api_key=GEMINI_API_KEY)
try:
    print("Listing available models...")
    # Try gemini-2.5-flash-lite
    model_name = "gemini-2.5-flash-lite"
    print(f"Testing {model_name}...")
    try:
        response = client.models.generate_content(
            model=model_name,
            contents="Hello",
        )
        print(f"SUCCESS with {model_name}!")
        print(response.text)
    except Exception as e:
        print(f"FAILED {model_name}: {e}")

except Exception as e:
    print(f"\nERROR LISTING MODELS: {e}")
