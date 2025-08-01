# Drvyn - AI Productivity Dashboard

A modern, AI-powered productivity dashboard built with React, TypeScript, and Flask backend.

## ✨ Features

- **🤖 AI-Powered Scheduling**: Natural language task scheduling with Cohere AI
- **📅 Multi-View Calendar**: Day, week, and month views with event management
- **🔐 User Authentication**: Secure login and registration system
- **🎨 Modern UI**: Beautiful, responsive design with shadcn/ui components
- **⚡ Real-time Updates**: Live calendar updates with backend synchronization
- **📱 Mobile Responsive**: Works perfectly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ and pip
- Cohere API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd drvyn-ai-productivity
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   # Create .env file
   echo "COHERE_API_KEY=your_cohere_api_key_here" > .env
   ```

5. **Initialize the database**
   ```bash
   python3 init_db.py
   ```

6. **Start the backend**
   ```bash
   python3 app.py
   ```

7. **Start the frontend** (in a new terminal)
   ```bash
   npm run dev
   ```

8. **Open your browser**
   Navigate to `http://localhost:8080`

## 🎯 Usage

1. **Register/Login**: Create an account or sign in
2. **AI Scheduling**: Use natural language to schedule events
   - "Schedule a meeting tomorrow at 2pm"
   - "Block out 3 hours for essay writing on Friday"
   - "Add a workout session this afternoon"
3. **Calendar Management**: View, edit, and delete events
4. **Multi-View Calendar**: Switch between day, week, and month views

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **shadcn/ui** for beautiful, accessible components
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** with Zod validation
- **Sonner** for toast notifications

### Backend
- **Flask** Python web framework
- **SQLAlchemy** for database ORM
- **Flask-Login** for authentication
- **Flask-CORS** for cross-origin requests
- **Cohere AI** for natural language processing

## 📁 Project Structure

```
drvyn-ai-productivity/
├── src/                    # React frontend source
│   ├── components/         # UI components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Page components
│   └── lib/               # Utilities and API
├── public/                # Static assets
├── app.py                 # Flask backend
├── requirements.txt       # Python dependencies
├── package.json           # Node.js dependencies
└── .env                   # Environment variables
```

## 🔧 Development

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development
```bash
python3 app.py       # Start Flask server
```

## 🌐 API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/events` - Get user's events
- `POST /api/events` - Create new event
- `PUT /api/events/<id>` - Update event
- `DELETE /api/events/<id>` - Delete event
- `POST /ai` - AI chat endpoint

## 🤖 AI Features

The application uses Cohere AI for natural language processing:

- **Natural Language Scheduling**: Convert plain English to calendar events
- **Smart Date Parsing**: Understand "tomorrow", "next week", "this afternoon"
- **Context Awareness**: Consider user's timezone and existing events
- **JSON Response Format**: Structured responses for reliable parsing

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with ❤️ using React, TypeScript, and Flask**
# Force Vercel deployment
