# 🚂 Railway Backend Deployment Guide

## Step 1: Prepare Your Repository

1. **Commit and push all changes to GitHub**
   ```bash
   git add .
   git commit -m "Add deployment configurations"
   git push origin main
   ```

## Step 2: Deploy to Railway

### 2.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Click "Login" and sign in with GitHub
3. Authorize Railway to access your repositories

### 2.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `InMatch-Pro` repository
4. Railway will start analyzing your repository

### 2.3 Configure Backend Service
1. Railway will detect multiple services, select "backend" folder
2. Or manually set:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`

### 2.4 Set Environment Variables
In Railway dashboard, go to Variables tab and add:

```
ENVIRONMENT=production
CORS_ORIGINS=https://your-frontend-domain.vercel.app
SECRET_KEY=your-super-secret-production-key-here
LOG_LEVEL=INFO
```

**Important**: Replace `your-frontend-domain.vercel.app` with your actual Vercel domain (we'll get this in the next step).

### 2.5 Deploy
1. Click "Deploy"
2. Wait for build to complete (usually 2-3 minutes)
3. Railway will provide you with a URL like: `https://your-app-name.railway.app`

### 2.6 Test Backend
1. Visit your Railway URL + `/health` (e.g., `https://your-app-name.railway.app/health`)
2. You should see: `{"status": "ok", "environment": "production"}`
3. Visit your Railway URL + `/docs` to see the API documentation

## Step 3: Note Your Backend URL

**Save this URL** - you'll need it for the frontend deployment:
```
https://your-app-name.railway.app
```

## Troubleshooting

### Build Fails
- Check the build logs in Railway dashboard
- Ensure `requirements.txt` is in the backend folder
- Verify Python version compatibility

### App Crashes
- Check the deployment logs
- Verify environment variables are set correctly
- Ensure the start command is correct

### CORS Errors (after frontend deployment)
- Update `CORS_ORIGINS` environment variable with your frontend domain
- Redeploy the service

## Next Steps

Once your backend is deployed and working:
1. ✅ Backend deployed to Railway
2. 🔄 Deploy frontend to Vercel (next step)
3. 🔧 Update CORS settings
4. 🧪 Test the full application
