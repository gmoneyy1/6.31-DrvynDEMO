# Drvyn - AI Productivity Dashboard

A modern, AI-powered productivity dashboard built with React, TypeScript, and Flask backend.

## Features

- **AI-Powered Scheduling**: Natural language task scheduling with AI assistance
- **24-Hour Calendar**: Full day scheduling from midnight to midnight
- **Event Management**: Create, edit, and delete calendar events
- **User Authentication**: Secure login and registration system
- **Real-time Updates**: Live calendar updates with backend synchronization
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

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
- **AI Integration** with OpenAI and Cohere APIs

## Quick Start

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
   cd backend
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   # Create .env file in backend directory
   echo "COHERE_API_KEY=your_cohere_api_key_here" > backend/.env
   ```

5. **Start the backend**
   ```bash
   cd backend
   python app.py
   ```

6. **Start the frontend** (in a new terminal)
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:8080`

## Usage

1. **Register/Login**: Create an account or sign in
2. **Schedule Tasks**: Use the AI chatbot to schedule events naturally
   - "Schedule a meeting tomorrow at 2pm"
   - "Block out 3 hours for essay writing on Friday"
   - "Add a workout session this afternoon"
3. **Manage Events**: Edit or delete events directly from the calendar
4. **View Calendar**: Switch between day, week, and month views

## Development

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development
```bash
cd backend
python app.py        # Start Flask server
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/events` - Get user's events
- `POST /api/events` - Create new event
- `PUT /api/events/<id>` - Update event
- `DELETE /api/events/<id>` - Delete event
- `POST /ai` - AI chat endpoint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
