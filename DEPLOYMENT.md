# 🚀 Deployment Guide

This guide covers deploying the Drvyn AI Productivity Dashboard to various hosting platforms.

## 📋 Prerequisites

- **GitHub Repository**: https://github.com/gmoneyy1/6.31-DrvynDEMO
- **Cohere API Key**: Get from https://cohere.ai/
- **GitHub Account**: For repository access

## 🎯 Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) - Recommended

#### Frontend Deployment (Vercel)

1. **Go to https://vercel.com**
2. **Import your GitHub repository**
3. **Configure build settings:**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Add environment variables:**
   - `VITE_API_BASE_URL`: Your backend URL
5. **Deploy!**

#### Backend Deployment (Railway)

1. **Go to https://railway.app**
2. **Connect your GitHub repository**
3. **Add environment variables:**
   - `COHERE_API_KEY`: Your Cohere API key
   - `FLASK_SECRET_KEY`: Generate a secure secret
   - `DATABASE_URL`: Railway will provide this
4. **Deploy!**

## 🔧 Environment Variables

### Frontend (Vercel)
```
VITE_API_BASE_URL=https://your-backend-url.com
```

### Backend (Railway/Render/Heroku)
```
COHERE_API_KEY=your_cohere_api_key_here
FLASK_SECRET_KEY=your_secure_secret_key
DATABASE_URL=your_database_url
AI_PROVIDER=cohere
```

## 🎯 Success Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and loading
- [ ] API communication working
- [ ] Authentication functional
- [ ] AI features operational
- [ ] Calendar views working
- [ ] Mobile responsive

---

**Need help?** Check the platform-specific documentation or create an issue in the GitHub repository.
