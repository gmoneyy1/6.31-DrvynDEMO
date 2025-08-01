from flask import Flask, render_template, request, jsonify, session, send_from_directory, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import cohere
from uuid import uuid4
import os
import json
from datetime import datetime, timezone, timedelta
import pytz
from functools import wraps
import logging
from collections import defaultdict
import time
import re

# Load environment
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv("FLASK_SECRET_KEY", str(uuid4()))
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///drvyn.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 🔑 Session cookies cross-origin fix
app.config.update(
    SESSION_COOKIE_SAMESITE="None",
    SESSION_COOKIE_SECURE=True
)

# CORS configuration
allowed_origins = os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")
origins = [origin.strip() for origin in allowed_origins if origin.strip()]
if not origins:
    origins = [
        "http://localhost:8080",
        "http://localhost:5173",
        "http://localhost:3000",
        "https://6-31-drvyn-demo.vercel.app",
    ]
CORS(app, supports_credentials=True, resources={r"/*": {"origins": origins}})

# Database + Login setup
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# AI provider
COHERE_API_KEY = os.getenv("COHERE_API_KEY")

# ---------------------------
# Models
# ---------------------------
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    timezone = db.Column(db.String(50), default='UTC')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    events = db.relationship('Event', backref='user', lazy=True)
    conversations = db.relationship('Conversation', backref='user', lazy=True)

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Conversation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))

# ---------------------------
# Rate Limit
# ---------------------------
request_counts = defaultdict(list)
def rate_limit(max_requests=20, window=60):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            uid = current_user.id if current_user.is_authenticated else request.remote_addr
            now = time.time()
            user_requests = request_counts[uid]
            user_requests[:] = [t for t in user_requests if now - t < window]
            if len(user_requests) >= max_requests:
                return jsonify({"error": "Rate limit exceeded"}), 429
            user_requests.append(now)
            return f(*args, **kwargs)
        return decorated
    return decorator

@app.before_request
def handle_options():
    """Handle all OPTIONS to prevent 405"""
    if request.method == "OPTIONS":
        return '', 200

# ---------------------------
# Routes
# ---------------------------
@app.route("/health")
def health():
    return jsonify({"status": "ok", "build": "2025-08-01-1430", "updated": True})

@app.route("/version")
def version():
    return jsonify({"version": "v2025-08-01-1430", "updated": True})

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password_hash, password):
        login_user(user)
        return jsonify({"success": True})
    return jsonify({"success": False, "error": "Invalid credentials"}), 401

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "Username exists"}), 400
    user = User(username=data["username"], email=data["email"],
                password_hash=generate_password_hash(data["password"]))
    db.session.add(user)
    db.session.commit()
    login_user(user)
    return jsonify({"success": True})

@app.route("/logout")
def logout():
    logout_user()
    return jsonify({"success": True})

@app.route("/api/user")
@login_required
def get_user():
    return jsonify({"id": current_user.id, "username": current_user.username, "email": current_user.email})

@app.route("/api/events", methods=["GET"])
@login_required
def get_events():
    events = Event.query.filter_by(user_id=current_user.id).all()
    return jsonify({"events": [{"id": e.id, "title": e.title,
                                "start": e.start_time.isoformat(),
                                "end": e.end_time.isoformat()} for e in events]})

@app.route("/ai", methods=["POST"])
@login_required
def ai():
    user_input = request.json.get("input")
    if not user_input:
        return jsonify({"error": "No input"}), 400

    conv = Conversation(user_id=current_user.id, role="user", content=user_input)
    db.session.add(conv)
    db.session.commit()

    messages = [{"role": "system", "content": get_ai_prompt()}]
    co = cohere.Client(COHERE_API_KEY)
    resp = co.generate(prompt=user_input, max_tokens=300)
    assistant_msg = resp.generations[0].text.strip()

    db.session.add(Conversation(user_id=current_user.id, role="assistant", content=assistant_msg))
    db.session.commit()

    parsed = [{"command": "MESSAGE", "text": assistant_msg}]
    try:
        match = re.search(r'\[.*\]', assistant_msg, re.DOTALL)
        if match:
            parsed = json.loads(match.group(0))
    except:
        pass

    return jsonify({"commands": parsed})

def get_ai_prompt():
    return """
You are Drvyn, a helpful assistant. Always return ONLY valid JSON arrays in responses.
"""

# ---------------------------
# Init Demo User
# ---------------------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        if not User.query.filter_by(username="demo").first():
            demo_user = User(username="demo", email="demo@example.com",
                             password_hash=generate_password_hash("demo123"))
            db.session.add(demo_user)
            db.session.commit()
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
