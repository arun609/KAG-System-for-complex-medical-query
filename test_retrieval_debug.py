
import sys
import os

# Add backend to path so we can import Scripts
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from Scripts.retrieval.hybrid_retrieval import retrieve_knowledge

query = "parkinson"
print(f"Testing retrieval for: {query}")
try:
    results = retrieve_knowledge(query)
    print(f"Found {len(results)} results.")
    for r in results:
        print(f"- {r[:100]}...")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
