#!/usr/bin/env python3
"""
Script to add a demo user to the database
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db, User
from werkzeug.security import generate_password_hash

def add_demo_user():
    with app.app_context():
        # Check if demo user already exists
        demo_user = User.query.filter_by(username='demo').first()
        if demo_user:
            print("Demo user already exists!")
            return
        
        # Create demo user
        demo_user = User(
            username='demo',
            email='demo@example.com',
            password_hash=generate_password_hash('demo123'),
            timezone='UTC'
        )
        
        db.session.add(demo_user)
        db.session.commit()
        print("Demo user created successfully!")
        print("Username: demo")
        print("Password: demo123")

if __name__ == "__main__":
    add_demo_user() 