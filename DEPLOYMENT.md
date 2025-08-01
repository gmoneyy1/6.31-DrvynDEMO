# 🚀 Deployment Guide

This guide covers deploying the Drvyn AI Productivity Dashboard to various hosting platforms.

## 📋 Prerequisites

- **GitHub Repository**: [https://github.com/gmoneyy1/6.31-DrvynDEMO](https://github.com/gmoneyy1/6.31-DrvynDEMO)
- **Cohere API Key**: Get from [https://cohere.ai/](https://cohere.ai/)
- **GitHub Account**: For repository access

## 🎯 Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) - Recommended

#### Frontend Deployment (Vercel)

1. **Go to [Vercel.com](https://vercel.com)**
2. **Import your GitHub repository**
3. **Configure build settings:**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Add environment variables:**
   - `VITE_API_BASE_URL`: Your backend URL
5. **Deploy!**

#### Backend Deployment (Railway)

1. **Go to [Railway.app](https://railway.app)**
2. **Connect your GitHub repository**
3. **Add environment variables:**
   - `COHERE_API_KEY`: Your Cohere API key
   - `FLASK_SECRET_KEY`: Generate a secure secret
   - `DATABASE_URL`: Railway will provide this
4. **Deploy!**

### Option 2: Vercel (Frontend) + Render (Backend)

#### Frontend Deployment (Vercel)
Same as above.

#### Backend Deployment (Render)

1. **Go to [Render.com](https://render.com)**
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure:**
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python3 app.py`
5. **Add environment variables** (same as Railway)
6. **Deploy!**

### Option 3: Vercel (Frontend) + Heroku (Backend)

#### Frontend Deployment (Vercel)
Same as above.

#### Backend Deployment (Heroku)

1. **Install Heroku CLI**
2. **Login to Heroku:**
   ```bash
   heroku login
   ```
3. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   ```
4. **Add environment variables:**
   ```bash
   heroku config:set COHERE_API_KEY=your_api_key
   heroku config:set FLASK_SECRET_KEY=your_secret_key
   ```
5. **Deploy:**
   ```bash
   git push heroku hosting:main
   ```

## 🔧 Environment Variables

### Frontend (Vercel)
```env
VITE_API_BASE_URL=https://your-backend-url.com
```

### Backend (Railway/Render/Heroku)
```env
COHERE_API_KEY=your_cohere_api_key_here
FLASK_SECRET_KEY=your_secure_secret_key
DATABASE_URL=your_database_url
AI_PROVIDER=cohere
```

## 🌐 Domain Configuration

### Custom Domain Setup

1. **Frontend (Vercel):**
   - Go to your Vercel project settings
   - Add custom domain
   - Configure DNS records

2. **Backend (Railway/Render):**
   - Use the provided subdomain
   - Or configure custom domain in platform settings

## 🔄 Update Frontend API URL

After deploying the backend, update the frontend API configuration:

1. **In Vercel dashboard**, add environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend-url.com
   ```

2. **Redeploy frontend** to apply changes

## 📊 Monitoring & Logs

### Vercel (Frontend)
- **Analytics**: Built-in performance monitoring
- **Logs**: Available in project dashboard
- **Functions**: Serverless function logs

### Railway/Render (Backend)
- **Logs**: Real-time application logs
- **Metrics**: CPU, memory usage
- **Health Checks**: Automatic monitoring

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Ensure backend URL is correct in frontend
   - Check CORS configuration in `app.py`

2. **API Key Issues:**
   - Verify Cohere API key is set correctly
   - Check environment variable names

3. **Database Issues:**
   - Ensure DATABASE_URL is set
   - Check database initialization

4. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed

### Debug Commands

```bash
# Check environment variables
echo $COHERE_API_KEY

# Test backend locally
python3 app.py

# Test frontend build
npm run build

# Check API connectivity
curl https://your-backend-url.com/test
```

## 🔐 Security Considerations

1. **Environment Variables**: Never commit API keys to Git
2. **HTTPS**: All production deployments use HTTPS
3. **CORS**: Configured for production domains
4. **Rate Limiting**: Implemented in backend
5. **Input Validation**: All user inputs validated

## 📈 Performance Optimization

1. **Frontend:**
   - Vite build optimization
   - Code splitting
   - Image optimization

2. **Backend:**
   - Database connection pooling
   - Caching strategies
   - API response optimization

## 🎯 Success Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and loading
- [ ] API communication working
- [ ] Authentication functional
- [ ] AI features operational
- [ ] Calendar views working
- [ ] Mobile responsive
- [ ] Custom domain configured (optional)

---

**Need help?** Check the platform-specific documentation or create an issue in the GitHub repository. 