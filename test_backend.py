#!/usr/bin/env python3
"""
Test script to check if the backend is working properly
"""
import requests
import json

def test_backend():
    # Replace with your actual Railway URL
    base_url = "https://drvyndemo-production.up.railway.app"
    
    print("Testing backend endpoints...")
    
    # Test 1: Basic endpoint
    try:
        response = requests.get(f"{base_url}/")
        print(f"GET / - Status: {response.status_code}")
        print(f"Response: {response.text[:200]}")
    except Exception as e:
        print(f"Error testing GET /: {e}")
    
    # Test 2: Test endpoint
    try:
        response = requests.get(f"{base_url}/test")
        print(f"GET /test - Status: {response.status_code}")
        print(f"Response: {response.text[:200]}")
    except Exception as e:
        print(f"Error testing GET /test: {e}")
    
    # Test 3: Login endpoint (GET)
    try:
        response = requests.get(f"{base_url}/login")
        print(f"GET /login - Status: {response.status_code}")
        print(f"Response: {response.text[:200]}")
    except Exception as e:
        print(f"Error testing GET /login: {e}")
    
    # Test 4: Login endpoint (POST)
    try:
        data = {"username": "demo", "password": "demo"}
        response = requests.post(
            f"{base_url}/login",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        print(f"POST /login - Status: {response.status_code}")
        print(f"Response: {response.text[:200]}")
    except Exception as e:
        print(f"Error testing POST /login: {e}")

if __name__ == "__main__":
    test_backend() 