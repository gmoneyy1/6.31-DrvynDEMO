#!/usr/bin/env python3
"""
Generate a secure Flask secret key for deployment
"""
import secrets
import string

def generate_secret_key(length=32):
    """Generate a secure random secret key"""
    alphabet = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(alphabet) for _ in range(length))

if __name__ == "__main__":
    secret_key = generate_secret_key()
    print("Generated Flask Secret Key:")
    print(secret_key)
    print("\nAdd this to your environment variables as FLASK_SECRET_KEY") 