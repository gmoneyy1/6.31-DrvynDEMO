# Backend Deployment Fix

## The Problem
Railway is serving your frontend HTML files instead of running the Flask backend. This is because Railway detected both frontend and backend files in the same repository.

## The Solution
Deploy the backend from a separate directory that only contains backend files.

## Step 1: Create a New Repository for Backend

1. Create a new GitHub repository (e.g., `drvyn-backend`)
2. Copy only the backend files to this new repository

## Step 2: Backend Files to Include

Copy these files to your new backend repository:
- `app.py` (main Flask application)
- `requirements.txt` (Python dependencies)
- `Procfile` (tells Railway how to run the app)
- `runtime.txt` (Python version)
- `railway.json` (Railway configuration)

## Step 3: Deploy to Railway

1. Go to [Railway.app](https://railway.app)
2. Create a new project
3. Connect your new backend repository
4. Add environment variables:
   - `FLASK_SECRET_KEY` = `tI#4/fCoPW41GJ-Wpek9x<]'6)lKH%be`
   - `AI_PROVIDER` = `cohere`
   - `OPENAI_API_KEY` = (your OpenAI key if using)
   - `COHERE_API_KEY` = (your Cohere key if using)

## Step 4: Update Frontend

Once you have the new backend URL:
1. Update `VITE_API_BASE_URL` in Vercel with the new backend URL
2. Update CORS configuration in the backend with your frontend URL
3. Redeploy both services

## Alternative: Use the backend-only Directory

I've created a `backend-only/` directory with the necessary files. You can:

1. Create a new GitHub repository
2. Copy the contents of `backend-only/` to the new repository
3. Deploy that repository to Railway

This will ensure Railway runs the Python backend instead of serving static files. 