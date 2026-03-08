import requests
import json

BASE_URL = "http://localhost:8000"

def test_history(user_id):
    print(f"Testing history for user_id: {user_id}")
    try:
        if user_id is None:
             # Simulate what fetch might do if it coerced null to string "null" or similar, 
             # but standard fetch with template literal `${null}` becomes "null"
            url = f"{BASE_URL}/history/null"
        else:
            url = f"{BASE_URL}/history/{user_id}"
            
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Exception: {e}")
    print("-" * 20)

if __name__ == "__main__":
    # Test with normal user ID (assuming 1 exists)
    test_history(1)
    
    # Test with "null" string (which is what `${null}` becomes in JS)
    test_history(None)
    
    # Test with 0
    test_history(0)
