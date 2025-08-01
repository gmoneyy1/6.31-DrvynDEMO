#!/usr/bin/env python3

from app import app, db

with app.app_context():
    # Create all database tables
    db.create_all()
    print("Database initialized successfully!")
    print("Tables created: User, Event, Conversation") 