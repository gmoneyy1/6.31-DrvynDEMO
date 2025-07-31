# Quick Start: Deploy Backend

## 🚀 Immediate Steps

### 1. Deploy to Railway (Recommended)
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect it's a Python app

### 2. Set Environment Variables in Railway
Add these in your Railway dashboard:

| Variable | Value |
|----------|-------|
| `FLASK_SECRET_KEY` | `tI#4/fCoPW41GJ-Wpek9x<]'6)lKH%be` |
| `DATABASE_URL` | Auto-provided by Railway |
| `OPENAI_API_KEY` | Your OpenAI key (if using) |
| `COHERE_API_KEY` | Your Cohere key (if using) |
| `AI_PROVIDER` | `cohere` |

### 3. Get Your Backend URL
Railway will give you a URL like: `https://your-app-name.railway.app`

### 4. Update Frontend in Vercel
1. Go to your Vercel dashboard
2. Settings → Environment Variables
3. Add: `VITE_API_BASE_URL` = your backend URL

### 5. Update CORS in Backend
Replace the placeholder in `app.py` with your actual Vercel frontend URL, then redeploy.

## 📁 Files Created/Modified
- ✅ `Procfile` - Tells Railway how to run your app
- ✅ `runtime.txt` - Specifies Python version
- ✅ `requirements.txt` - Added gunicorn for production
- ✅ `app.py` - Updated CORS configuration
- ✅ `DEPLOYMENT.md` - Detailed deployment guide
- ✅ `FRONTEND_UPDATE.md` - Frontend configuration guide

## 🔑 Generated Secret Key
Use this for `FLASK_SECRET_KEY`: `tI#4/fCoPW41GJ-Wpek9x<]'6)lKH%be`

## 📋 Next Steps
1. Deploy to Railway
2. Get your backend URL
3. Set `VITE_API_BASE_URL` in Vercel
4. Update CORS with your frontend URL
5. Test the full application

## 🆘 Need Help?
- Check `DEPLOYMENT.md` for detailed instructions
- Check `FRONTEND_UPDATE.md` for frontend configuration
- Railway has excellent documentation and support 