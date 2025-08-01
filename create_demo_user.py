#!/usr/bin/env python3

from app import app, db, User
from werkzeug.security import generate_password_hash

def create_demo_user():
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
        
        print("✅ Demo user created successfully!")
        print("Username: demo")
        print("Password: demo123")
        print("You can now log in to test all features!")

if __name__ == "__main__":
    create_demo_user() 