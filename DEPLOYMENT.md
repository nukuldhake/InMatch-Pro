# 🚀 InMatch Pro Deployment Guide

This guide provides comprehensive instructions for deploying InMatch Pro across different platforms and environments.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
  - [Vercel + Railway](#vercel--railway)
  - [Netlify + Render](#netlify--render)
  - [Full Docker Cloud](#full-docker-cloud)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

Before deploying, ensure you have:

- **Node.js** (v18+ recommended)
- **Python** (3.8+ required)
- **Docker** and **Docker Compose** (for containerized deployment)
- **Git** for version control

## 🏠 Local Development

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/nukuldhake/InMatch-Pro.git
   cd InMatch-Pro
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your configuration
   uvicorn app.main:app --reload
   ```

3. **Frontend Setup** (in new terminal)
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

### Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🐳 Docker Deployment

### Local Docker Deployment

1. **Using deployment scripts**
   ```bash
   # Linux/Mac
   chmod +x scripts/deploy-local.sh
   ./scripts/deploy-local.sh
   
   # Windows
   scripts\deploy-local.bat
   ```

2. **Manual Docker Compose**
   ```bash
   # Create environment files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   
   # Build and start
   docker-compose up -d
   
   # View logs
   docker-compose logs -f
   
   # Stop services
   docker-compose down
   ```

### Access Points
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000

## ☁️ Cloud Deployment

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Deploy Backend to Railway

1. **Create Railway account** at [railway.app](https://railway.app)

2. **Deploy from GitHub**
   - Connect your GitHub repository
   - Select the backend folder as root
   - Railway will auto-detect Python and use the `railway.toml` config

3. **Set Environment Variables**
   ```
   ENVIRONMENT=production
   CORS_ORIGINS=https://your-frontend-domain.vercel.app
   SECRET_KEY=your-super-secret-key
   ```

4. **Note your Railway backend URL** (e.g., `https://your-app.railway.app`)

#### Deploy Frontend to Vercel

1. **Create Vercel account** at [vercel.com](https://vercel.com)

2. **Deploy from GitHub**
   - Import your repository
   - Set build settings:
     - Framework: Vite
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `dist`

3. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend.railway.app
   VITE_ENVIRONMENT=production
   ```

### Option 2: Netlify (Frontend) + Render (Backend)

#### Deploy Backend to Render

1. **Create Render account** at [render.com](https://render.com)

2. **Create Web Service**
   - Connect GitHub repository
   - Use these settings:
     - Environment: Python
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`

3. **Set Environment Variables**
   ```
   ENVIRONMENT=production
   PYTHONPATH=/opt/render/project/src
   CORS_ORIGINS=https://your-frontend.netlify.app
   ```

#### Deploy Frontend to Netlify

1. **Create Netlify account** at [netlify.com](https://netlify.com)

2. **Deploy from GitHub**
   - Connect repository
   - Build settings are auto-configured from `netlify.toml`

3. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend.onrender.com
   VITE_ENVIRONMENT=production
   ```

### Option 3: Full Docker Cloud Deployment

For platforms supporting Docker (DigitalOcean, AWS, GCP, Azure):

1. **Build and push images**
   ```bash
   # Build images
   docker build -t inmatch-backend ./backend
   docker build -t inmatch-frontend ./frontend
   
   # Tag for registry
   docker tag inmatch-backend your-registry/inmatch-backend:latest
   docker tag inmatch-frontend your-registry/inmatch-frontend:latest
   
   # Push to registry
   docker push your-registry/inmatch-backend:latest
   docker push your-registry/inmatch-frontend:latest
   ```

2. **Deploy using docker-compose** on your cloud instance

## ⚙️ Environment Configuration

### Backend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `ENVIRONMENT` | Deployment environment | `development` | No |
| `HOST` | Server host | `0.0.0.0` | No |
| `PORT` | Server port | `8000` | No |
| `CORS_ORIGINS` | Allowed CORS origins | `localhost` | Yes |
| `SECRET_KEY` | Security key | - | Yes |
| `LOG_LEVEL` | Logging level | `INFO` | No |

### Frontend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` | Yes |
| `VITE_ENVIRONMENT` | Environment | `development` | No |
| `VITE_APP_NAME` | Application name | `InMatch Pro` | No |

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CORS_ORIGINS` includes your frontend domain
   - Check protocol (http vs https) matches

2. **API Connection Failed**
   - Verify `VITE_API_URL` points to correct backend
   - Check backend health endpoint: `/health`

3. **Docker Build Fails**
   - Ensure Docker has enough memory (4GB+)
   - Check for port conflicts

4. **Environment Variables Not Loading**
   - Verify `.env` files exist and are properly formatted
   - Restart services after changing environment variables

### Health Checks

- **Backend Health**: `GET /health`
- **Frontend Health**: `GET /health` (nginx endpoint)

### Logs

```bash
# Docker logs
docker-compose logs -f [service-name]

# Railway logs
railway logs

# Render logs
Available in Render dashboard

# Vercel logs
Available in Vercel dashboard
```

## 📞 Support

For deployment issues:
1. Check the troubleshooting section above
2. Review application logs
3. Verify environment configuration
4. Open an issue on GitHub with deployment details

---

**Happy Deploying! 🎉**
