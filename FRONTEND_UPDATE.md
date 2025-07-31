# Frontend Configuration Update Guide

## After Backend Deployment

Once you've deployed your backend to Railway or Render, you'll need to update your frontend to point to the new backend URL.

## Step 1: Get Your Backend URL

After deploying to Railway or Render, you'll get a URL like:
- Railway: `https://your-app-name.railway.app`
- Render: `https://your-app-name.onrender.com`

## Step 2: Update Frontend Environment Variables

### Option A: Using Vercel Environment Variables (Recommended)

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add a new environment variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: Your backend URL (e.g., `https://your-app-name.railway.app`)
   - **Environment**: Production (and Preview if needed)

### Option B: Using Local .env File (for development)

Create a `.env.local` file in your project root:
```env
VITE_API_BASE_URL=https://your-app-name.railway.app
```

## Step 3: Update Backend CORS Configuration

After getting your frontend URL from Vercel, update the CORS configuration in your backend (`app.py`):

```python
CORS(app, supports_credentials=True, origins=[
    "http://localhost:8080", 
    "http://localhost:5173", 
    "http://localhost:3000",
    "https://your-actual-frontend-domain.vercel.app"  # Replace with your actual Vercel URL
])
```

## Step 4: Redeploy Backend

After updating the CORS configuration:
1. Commit and push your changes to GitHub
2. Railway/Render will automatically redeploy your backend

## Step 5: Redeploy Frontend

After setting the environment variable in Vercel:
1. Go to your Vercel dashboard
2. Click "Redeploy" on your project

## Step 6: Test the Integration

1. Visit your frontend URL
2. Try to log in or register
3. Check the browser's developer console for any CORS errors
4. Test the AI chat functionality

## Troubleshooting

### Common Issues:

1. **CORS Errors**: 
   - Make sure your frontend URL is in the backend's CORS origins list
   - Check that the URLs match exactly (including https://)

2. **API Connection Errors**:
   - Verify `VITE_API_BASE_URL` is set correctly in Vercel
   - Check that your backend is running and accessible

3. **Authentication Issues**:
   - Ensure cookies are being sent with requests (`credentials: 'include'`)
   - Check that the backend's `FLASK_SECRET_KEY` is set

### Debugging Steps:

1. Check browser console for errors
2. Verify the API calls are going to the correct URL
3. Test the backend directly by visiting the backend URL
4. Check Railway/Render logs for any backend errors

## Environment Variables Summary

| Platform | Variable | Value |
|----------|----------|-------|
| Vercel (Frontend) | `VITE_API_BASE_URL` | Your backend URL |
| Railway/Render (Backend) | `FLASK_SECRET_KEY` | Generated secret key |
| Railway/Render (Backend) | `DATABASE_URL` | Auto-provided by platform |
| Railway/Render (Backend) | `OPENAI_API_KEY` | Your OpenAI key |
| Railway/Render (Backend) | `COHERE_API_KEY` | Your Cohere key |

## Final Checklist

- [ ] Backend deployed to Railway/Render
- [ ] Backend URL obtained
- [ ] `VITE_API_BASE_URL` set in Vercel
- [ ] CORS configuration updated in backend
- [ ] Backend redeployed with new CORS settings
- [ ] Frontend redeployed with new environment variable
- [ ] Full application tested and working 