# Backend Integration Guide for Drvyn Dashboard

This guide will help you set up the Flask backend and integrate it with your React frontend.

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Run the setup script
python backend-setup.py

# Or manually install dependencies
pip install -r requirements.txt

# Update your .env file with API keys
# Edit .env and add your Cohere or OpenAI API key

# Start the backend
python app.py
```

### 2. Frontend Setup

```bash
# Install frontend dependencies (if not already done)
npm install

# Start the frontend
npm run dev
```

## 📋 Backend Features

### ✅ Authentication System
- User registration and login
- Session management with Flask-Login
- Password hashing with Werkzeug
- Protected routes and API endpoints

### ✅ Calendar API
- Create, read, update, delete events
- User-specific event management
- ISO date format handling
- Rate limiting (20-30 requests per minute)

### ✅ AI Chat Integration
- Natural language task scheduling
- Conversation persistence
- Multi-provider support (OpenAI/Cohere)
- Smart scheduling with context awareness

### ✅ Database Models
- User management
- Event storage
- Conversation history
- SQLite database (easily switchable to PostgreSQL/MySQL)

## 🔧 Configuration

### Environment Variables (.env)

```env
FLASK_SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///drvyn.db
COHERE_API_KEY=your-cohere-api-key
AI_PROVIDER=cohere
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/login` | POST | User authentication |
| `/register` | POST | User registration |
| `/api/events` | GET | Fetch user events |
| `/api/events` | POST | Create new event |
| `/api/events/:id` | PUT | Update event |
| `/api/events/:id` | DELETE | Delete event |
| `/api/user` | GET | Get user profile |
| `/api/user/timezone` | PUT | Update user timezone |
| `/ai` | POST | AI chat endpoint |

## 🎯 Frontend Integration

### Authentication Flow

The frontend now includes:
- **Login/Register pages** with modern UI
- **Protected routes** that redirect to login
- **User context** throughout the app
- **Logout functionality** in sidebar

### AI Chat Integration

The dashboard now features:
- **Real-time AI chat** with backend
- **Natural language scheduling**
- **Conversation history**
- **Smart task parsing**

### Calendar Integration

Events are now:
- **Persisted in database**
- **User-specific**
- **Real-time updates**
- **Full CRUD operations**

## 🔄 API Response Formats

### Events
```json
{
  "events": [
    {
      "id": 1,
      "title": "Math Study",
      "start": "2025-07-30T10:00:00",
      "end": "2025-07-30T11:00:00"
    }
  ]
}
```

### AI Commands
```json
{
  "commands": [
    {
      "command": "ADD",
      "start": "2025-07-30T10:00:00",
      "end": "2025-07-30T11:00:00",
      "title": "Math Study"
    },
    {
      "command": "MESSAGE",
      "text": "I've scheduled your math study session!"
    }
  ]
}
```

### User Profile
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "timezone": "America/New_York"
}
```

## 🛠️ Development

### Backend Development

```bash
# Start with auto-reload
python app.py

# Or with Flask CLI
export FLASK_APP=app.py
export FLASK_ENV=development
flask run --port=8000
```

### Frontend Development

```bash
# Start development server
npm run dev

# Build for production
npm run build
```

### Database Management

```python
# Access Flask shell
flask shell

# Create tables
db.create_all()

# Add test user
from app import User, db
user = User(username='test', email='test@example.com', password_hash='...')
db.session.add(user)
db.session.commit()
```

## 🔒 Security Features

- **Rate limiting** on all API endpoints
- **Password hashing** with Werkzeug
- **Session management** with Flask-Login
- **Input validation** and sanitization
- **CORS handling** for cross-origin requests

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Backend runs on port 8000
   - Frontend configured to connect to `http://localhost:8000`
   - Add CORS headers if needed

2. **API Key Issues**
   - Check `.env` file configuration
   - Verify API key is valid
   - Test with curl: `curl -X POST http://localhost:8000/ai -H "Content-Type: application/json" -d '{"input":"test"}'`

3. **Database Issues**
   - Ensure `drvyn.db` file is writable
   - Run `db.create_all()` in Flask shell
   - Check SQLite installation

4. **Authentication Issues**
   - Clear browser cookies
   - Check session configuration
   - Verify user exists in database

### Debug Mode

```python
# Enable debug logging
import logging
logging.basicConfig(level=logging.DEBUG)

# Check database
from app import db, User, Event
with app.app_context():
    users = User.query.all()
    events = Event.query.all()
    print(f"Users: {len(users)}, Events: {len(events)}")
```

## 📊 Testing

### API Testing

```bash
# Test authentication
curl -X POST http://localhost:8000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password"}'

# Test AI chat
curl -X POST http://localhost:8000/ai \
  -H "Content-Type: application/json" \
  -d '{"input":"Schedule a meeting tomorrow at 2pm"}'
```

### Frontend Testing

```bash
# Test build
npm run build

# Test production build
npm run preview
```

## 🚀 Production Deployment

### Backend Deployment

1. **Environment Setup**
   ```bash
   # Set production environment
   export FLASK_ENV=production
   export DATABASE_URL=postgresql://user:pass@localhost/drvyn
   ```

2. **WSGI Server**
   ```bash
   # Install Gunicorn
   pip install gunicorn
   
   # Start server
   gunicorn -w 4 -b 0.0.0.0:8000 app:app
   ```

3. **Database Migration**
   ```bash
   # For PostgreSQL
   pip install psycopg2-binary
   # Update DATABASE_URL in .env
   ```

### Frontend Deployment

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Serve Static Files**
   ```bash
   # Using nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           root /path/to/dist;
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:8000;
       }
   }
   ```

## 📈 Monitoring

### Health Check

```bash
# Check backend status
curl http://localhost:8000/api/user

# Check database
sqlite3 drvyn.db "SELECT COUNT(*) FROM user;"
```

### Logs

```bash
# Backend logs
tail -f app.log

# Access logs
tail -f /var/log/nginx/access.log
```

## 🎉 Success!

Your Drvyn dashboard is now fully integrated with:

- ✅ **User authentication** and session management
- ✅ **Real-time AI chat** with natural language scheduling
- ✅ **Persistent calendar** with full CRUD operations
- ✅ **Modern UI** with responsive design
- ✅ **Production-ready** backend with security features

The application is ready for development and can be easily deployed to production environments! 