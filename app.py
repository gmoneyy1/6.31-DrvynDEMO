from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from dotenv import load_dotenv
import cohere
from uuid import uuid4
import os
import json
from datetime import datetime, timedelta
import pytz
from functools import wraps
import logging
from collections import defaultdict
import time
import re

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv("FLASK_SECRET_KEY", str(uuid4()))
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///drvyn.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configure CORS
allowed_origins = os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")
origins = [o.strip() for o in allowed_origins if o.strip()]
if not origins:
    origins = [
        "http://localhost:8080",
        "http://localhost:5173",
        "http://localhost:3000",
        "https://6-31-drvyn-demo.vercel.app",
        "https://6-31-drvyn-demo-258mumzzp-george-s-projects-afbe87b4.vercel.app",
        "https://6-31-drvyn-demo-gxxwzbk5b-george-s-projects-afbe87b4.vercel.app"
    ]

CORS(app, resources={r"/*": {"origins": origins}}, supports_credentials=True)

@app.before_request
def log_request_info():
    app.logger.info(f"Incoming {request.method} to {request.path}")

@app.before_request
def handle_options():
    if request.method == 'OPTIONS':
        return '', 200

# Database & Login
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Models
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
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Conversation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))

# Rate limiting
request_counts = defaultdict(list)
def rate_limit(max_requests=20, window=60):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user_id = current_user.id if current_user.is_authenticated else request.remote_addr
            now = time.time()
            user_requests = request_counts[user_id]
            user_requests[:] = [t for t in user_requests if now - t < window]
            if len(user_requests) >= max_requests:
                return jsonify({"error": "Rate limit exceeded"}), 429
            user_requests.append(now)
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def clear_rate_limits():
    request_counts.clear()
    app.logger.info("Rate limits cleared")

# Routes
@app.route("/")
def index():
    return jsonify({"message": "Drvyn API is running", "status": "ok"})

@app.route("/health")
def health():
    return jsonify({"status": "ok", "message": "Server running"})

@app.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    username, password = data.get('username'), data.get('password')
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password_hash, password):
        login_user(user)
        return jsonify({"success": True, "user": {"id": user.id, "username": user.username}})
    return jsonify({"success": False, "error": "Invalid credentials"}), 401

@app.route("/register", methods=['POST'])
def register():
    try:
        data = request.get_json()
        username, email, password = data.get('username'), data.get('email'), data.get('password')
        if User.query.filter_by(username=username).first():
            return jsonify({"success": False, "error": "Username exists"}), 400
        if User.query.filter_by(email=email).first():
            return jsonify({"success": False, "error": "Email exists"}), 400
        user = User(username=username, email=email, password_hash=generate_password_hash(password))
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return jsonify({"success": True, "user": {"id": user.id, "username": user.username}})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/logout")
def logout():
    logout_user()
    return jsonify({"success": True})

@app.route("/api/user", methods=['GET', 'OPTIONS'])
@login_required
def get_user():
    if request.method == 'OPTIONS':
        return '', 200
    return jsonify({
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "timezone": current_user.timezone
    })

@app.route("/api/events", methods=['GET', 'OPTIONS'])
@login_required
def get_events():
    if request.method == 'OPTIONS':
        return '', 200
    try:
        events = Event.query.filter_by(user_id=current_user.id).all()
        return jsonify({"events": [{
            "id": e.id, "title": e.title,
            "start": e.start_time.isoformat(), "end": e.end_time.isoformat()
        } for e in events]})
    except Exception as e:
        app.logger.error(f"Error fetching events: {e}")
        return jsonify({"error": "Failed to fetch events"}), 500

# AI Route
@app.route("/ai", methods=["POST"])
@login_required
def ai():
    try:
        app.logger.info(f"AI request received from user {current_user.username}")
        user_input = request.json.get("input")
        app.logger.info(f"User input: {user_input}")
        
        if not user_input:
            return jsonify({"error": "No input provided"}), 400

        # Call Cohere AI service
        app.logger.info("Calling Cohere AI service")
        api_key = os.getenv("COHERE_API_KEY")
        if not api_key or api_key == "your-cohere-api-key-here":
            assistant_msg = "I'm sorry, but the Cohere API key is not configured. Please set up your Cohere API key in the .env file."
        else:
            try:
                co = cohere.Client(api_key)
                full_prompt = f"{get_ai_prompt()}\nUser: {user_input}\nAssistant:"
                app.logger.info(f"Sending prompt to Cohere: {full_prompt[:200]}...")
                response = co.generate(
                    prompt=full_prompt,
                    max_tokens=500,
                    temperature=0.7,
                    k=0, p=0.95
                )
                assistant_msg = response.generations[0].text.strip()
                app.logger.info(f"Cohere response: {assistant_msg}")
            except Exception as e:
                app.logger.error(f"Cohere API error: {e}")
                assistant_msg = f"I'm sorry, but there was an error with the Cohere service: {str(e)}"

        # Parse commands - relaxed for debug
        parsed_commands = []
        try:
            json_match = re.search(r'\[.*\]', assistant_msg, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
                parsed_commands = json.loads(json_str)
                if not isinstance(parsed_commands, list):
                    parsed_commands = [{"command": "MESSAGE", "text": assistant_msg}]
            else:
                # Fallback: wrap whole AI message as MESSAGE
                parsed_commands = [{"command": "MESSAGE", "text": assistant_msg}]
        except Exception as e:
            app.logger.warning(f"Failed to parse AI response as JSON: {e}")
            parsed_commands = [{"command": "MESSAGE", "text": assistant_msg}]
        
        return jsonify({"commands": parsed_commands})
    except Exception as e:
        app.logger.error(f"Error in AI chat: {e}", exc_info=True)
        return jsonify({"error": f"AI failed: {str(e)}"}), 500

def get_ai_prompt():
    return """
You are Drvyn, a productivity assistant. Always respond with a valid JSON array.
Commands: ADD (schedule), REMOVE (delete), MESSAGE (respond)
"""

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        if not User.query.filter_by(username='demo').first():
            demo_user = User(
                username='demo',
                email='demo@example.com',
                password_hash=generate_password_hash('demo123')
            )
            db.session.add(demo_user)
            db.session.commit()
            app.logger.info("Demo user created")
    clear_rate_limits()
    app.run(debug=os.environ.get('FLASK_ENV')=='development',
            port=int(os.environ.get('PORT', 8000)),
            host='0.0.0.0')
