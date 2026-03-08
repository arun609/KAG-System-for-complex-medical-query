import requests
import json
import sys

BASE_URL = "http://localhost:8000"

def test_flow():
    print("1. Registering test user...")
    reg_payload = {"username": "testuser_verif", "password": "password123", "role": "student"}
    try:
        r = requests.post(f"{BASE_URL}/register", json=reg_payload)
        print(f"Register status: {r.status_code}, Body: {r.text}")
    except Exception as e:
        print(f"Register failed: {e}")

    print("\n2. Logging in...")
    login_payload = {"username": "testuser_verif", "password": "password123"}
    user_id = None
    try:
        r = requests.post(f"{BASE_URL}/login", json=login_payload)
        print(f"Login status: {r.status_code}, Body: {r.json()}")
        if r.status_code == 200:
            user_id = r.json().get("id")
            print(f"Logged in as User ID: {user_id}")
    except Exception as e:
        print(f"Login failed: {e}")
        return

    if user_id:
        print(f"\n3. Fetching History for User ID {user_id}...")
        try:
            r = requests.get(f"{BASE_URL}/history/{user_id}")
            print(f"History status: {r.status_code}")
            print(f"History items: {len(r.json())}")
        except Exception as e:
            print(f"Fetch history failed: {e}")

    print("\n4. Testing Guest/Null History Access...")
    # This should be 422 (Validation Error) or 404/Empty depending on implementation
    try:
        r = requests.get(f"{BASE_URL}/history/null")
        print(f"GET /history/null status: {r.status_code}")
        print(f"Response: {r.text}")
    except Exception as e:
        print(f"Guest history test failed: {e}")

    try:
        r = requests.get(f"{BASE_URL}/history/0")
        print(f"GET /history/0 status: {r.status_code}")
        print(f"Response: {r.text}")
    except Exception as e:
        print(f"Guest history (0) test failed: {e}")

if __name__ == "__main__":
    test_flow()
