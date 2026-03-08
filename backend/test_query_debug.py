import requests
import json

BASE_URL = "http://localhost:8000"

def test_query():
    query = "What are the symptoms of Parkinson's disease?"
    print(f"Sending query: {query}")
    
    payload = {"query": query}
    try:
        r = requests.post(f"{BASE_URL}/query", json=payload)
        print(f"Status Code: {r.status_code}")
        print("Response JSON:")
        print(json.dumps(r.json(), indent=2))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_query()
