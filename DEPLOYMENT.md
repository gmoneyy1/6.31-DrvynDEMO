# Backend Deployment Guide

## Overview
This guide will help you deploy the Flask backend to Railway or Render, which are excellent platforms for Python applications.

## Option 1: Deploy to Railway (Recommended)

### Step 1: Prepare Your Repository
1. Make sure your repository is pushed to GitHub
2. Ensure you have the following files in your root directory:
   - `app.py` (main Flask application)
   - `requirements.txt` (Python dependencies)
   - `Procfile` (tells Railway how to run your app)
   - `runtime.txt` (specifies Python version)

### Step 2: Deploy to Railway
1. Go to [Railway.app](https://railway.app)
2. Sign up/Login with your GitHub account
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will automatically detect it's a Python app

### Step 3: Configure Environment Variables
In your Railway dashboard, add these environment variables:
- `FLASK_SECRET_KEY` - A random secret key for Flask sessions
- `DATABASE_URL` - Railway will provide a PostgreSQL URL automatically
- `OPENAI_API_KEY` - Your OpenAI API key (if using OpenAI)
- `COHERE_API_KEY` - Your Cohere API key (if using Cohere)
- `AI_PROVIDER` - Set to "cohere" or "openai"

### Step 4: Update CORS Configuration
Replace the placeholder in `app.py` with your actual Vercel frontend URL:
```python
CORS(app, supports_credentials=True, origins=[
    "http://localhost:8080", 
    "http://localhost:5173", 
    "http://localhost:3000",
    "https://your-actual-frontend-domain.vercel.app"  # Replace this
])
```

## Option 2: Deploy to Render

### Step 1: Prepare Your Repository
Same as Railway - ensure all required files are present.

### Step 2: Deploy to Render
1. Go to [Render.com](https://render.com)
2. Sign up/Login with your GitHub account
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: `drvyn-backend` (or your preferred name)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`

### Step 3: Configure Environment Variables
Add the same environment variables as listed above in the Render dashboard.

## Database Setup

### For Railway (PostgreSQL)
Railway automatically provides a PostgreSQL database. The `DATABASE_URL` will be set automatically.

### For Render (PostgreSQL)
1. Create a new PostgreSQL database in Render
2. Copy the database URL to your environment variables

## Update Frontend Configuration

After deploying the backend, you'll need to update your frontend to point to the new backend URL:

1. Find your backend URL (Railway/Render will provide this)
2. Update your frontend API calls to use the new backend URL
3. Update the CORS configuration in the backend with your actual frontend URL

## Testing the Deployment

1. Visit your backend URL (e.g., `https://your-app.railway.app`)
2. You should see: `{"message": "Drvyn API is running", "status": "ok"}`
3. Test the `/test` endpoint: `https://your-app.railway.app/test`

## Troubleshooting

### Common Issues:
1. **CORS errors**: Make sure your frontend URL is in the CORS origins list
2. **Database errors**: Ensure `DATABASE_URL` is set correctly
3. **API key errors**: Verify all API keys are set in environment variables

### Logs:
- Railway: Check the "Deployments" tab for logs
- Render: Check the "Logs" tab in your service dashboard

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `FLASK_SECRET_KEY` | Secret key for Flask sessions | Yes |
| `DATABASE_URL` | Database connection string | Yes |
| `OPENAI_API_KEY` | OpenAI API key | If using OpenAI |
| `COHERE_API_KEY` | Cohere API key | If using Cohere |
| `AI_PROVIDER` | AI provider preference | No (defaults to "cohere") |

## Next Steps

1. Deploy the backend using one of the options above
2. Get your backend URL
3. Update your frontend to use the new backend URL
4. Update the CORS configuration with your actual frontend URL
5. Test the full application 