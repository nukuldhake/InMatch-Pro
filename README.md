# InMatch Pro - AI-Powered Cricket Analytics Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/FastAPI-Latest-green?style=for-the-badge&logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/TypeScript-5.5.3-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Python-3.12-yellow?style=for-the-badge&logo=python" alt="Python">
  <img src="https://img.shields.io/badge/TensorFlow-2.19-orange?style=for-the-badge&logo=tensorflow" alt="TensorFlow">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.11-blue?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/Deployed-Live-brightgreen?style=for-the-badge" alt="Live">
</div>

## 🚀 Live Application

**🌐 Try it now:** [https://in-match-pro.vercel.app](https://in-match-pro.vercel.app)

**📚 API Documentation:** [https://inmatch-pro-0w31.onrender.com/docs](https://inmatch-pro-0w31.onrender.com/docs)

## 🏏 Overview

**InMatch Pro** is an advanced AI-powered cricket analytics platform specifically designed for the Indian Premier League (IPL). It provides real-time match predictions, comprehensive player analytics, and strategic insights using cutting-edge machine learning models.

**✨ Fully deployed and operational** - No setup required, just visit the link above!

### ✨ Key Features

- **🎯 Live Match Prediction**: Real-time score and win probability predictions for ongoing IPL chases (second innings)
- **📊 Player Performance Analytics**: Predict individual player performance based on historical data and match conditions
- **🔍 Player Statistics Lookup**: Comprehensive player stats database with advanced filtering
- **👥 Player Clustering**: AI-powered player categorization and similarity analysis
- **🏆 Fantasy Points Estimation**: Optimize your fantasy cricket team with ML-powered point predictions
- **📈 Advanced Visualizations**: Interactive charts and graphs for match and player analytics

## 🏗️ Architecture

This is a full-stack application with a clear separation of concerns:

```
InMatch-Pro/
├── frontend/          # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages/routes
│   │   ├── data/          # Mock data and constants
│   │   └── App.tsx        # Main application component
│   ├── package.json
│   └── README.md
├── backend/           # FastAPI Python backend
│   ├── app/
│   │   ├── routes/        # API route handlers
│   │   ├── models/        # Pydantic data models
│   │   ├── services/      # Business logic and ML models
│   │   ├── data/          # JSON data files
│   │   └── main.py        # FastAPI application entry point
│   ├── requirements.txt
│   └── README.md
└── README.md         # This file
```

## 🚀 Quick Start

### 🌐 Use the Live Application (Recommended)

**No setup required!** Simply visit: [https://in-match-pro.vercel.app](https://in-match-pro.vercel.app)

The application is fully deployed and ready to use with all features operational.

### 🛠️ Local Development (Optional)

If you want to run the application locally for development:

#### Prerequisites

- **Node.js** (v18+ recommended)
- **Python** (3.12+ required)
- **Docker** (optional, for containerized deployment)

#### 1. Clone the Repository

```bash
git clone https://github.com/nukuldhake/InMatch-Pro.git
cd InMatch-Pro
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app.main:app --reload
```

The backend API will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

#### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will be available at `http://localhost:5173`

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - Modern UI library with hooks
- **TypeScript 5.5.3** - Type-safe JavaScript
- **Vite 5.4.1** - Fast build tool and dev server
- **Tailwind CSS 3.4.11** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **React Router 6.26.2** - Client-side routing
- **TanStack Query 5.56.2** - Data fetching and caching
- **Recharts 2.12.7** - Data visualization library
- **Lucide React** - Beautiful icon library

### Backend
- **FastAPI** - Modern, fast Python web framework
- **TensorFlow 2.19** - Deep learning framework for ML predictions
- **XGBoost** - Gradient boosting framework
- **Scikit-learn** - Machine learning library
- **Pandas** - Data manipulation and analysis
- **Pydantic** - Data validation using Python type annotations
- **Uvicorn** - ASGI server for FastAPI
- **Python-multipart** - File upload support
- **HTTPX** - Async HTTP client
- **Loguru** - Advanced logging

### Deployment & Infrastructure
- **Frontend**: Deployed on **Vercel** with automatic deployments
- **Backend**: Deployed on **Render** with Docker containerization
- **Python 3.12**: Latest stable Python version
- **CI/CD**: Automated deployment pipeline
- **HTTPS**: Secure connections with SSL certificates

## 📱 Application Features

### 🎯 Live Match Predictor
- Real-time score prediction for ongoing IPL chases
- Win probability calculation for both teams
- Match state visualization with key metrics
- Required run rate and current run rate analysis

### 📊 Player Performance Predictor
- Predict individual player performance
- Consider match conditions, venue, and opposition
- Historical performance analysis
- Form-based predictions

### 🔍 Player Stats Lookup
- Comprehensive player database
- Advanced filtering and search capabilities
- Career statistics and recent form
- Performance against specific teams/venues

### 👥 Player Clustering
- AI-powered player categorization
- Similarity analysis between players
- Performance-based clustering
- Visual representation of player groups

### 🏆 Fantasy Points Estimator
- Optimize fantasy cricket team selection
- ML-powered point predictions
- Player value analysis
- Team composition recommendations

## 🔧 Development

### Frontend Development

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend Development

```bash
cd backend

# Start with auto-reload
uvicorn app.main:app --reload

# Run with specific host and port
uvicorn app.main:app --host 0.0.0.0 --port 8000

# View API documentation
# Visit http://localhost:8000/docs
```

### Adding New Features

1. **Backend**: Add new routes in `backend/app/routes/`
2. **Frontend**: Create new pages in `frontend/src/pages/`
3. **Models**: Define data models in `backend/app/models/`
4. **Services**: Add business logic in `backend/app/services/`

## 📊 API Endpoints

**Base URL**: `https://inmatch-pro-0w31.onrender.com`

**Interactive Documentation**: [https://inmatch-pro-0w31.onrender.com/docs](https://inmatch-pro-0w31.onrender.com/docs)

### Live Match Prediction
- `POST /api/live-match/predict` - Real-time match outcome prediction

### Player Performance
- `POST /api/player-performance/predict_player_performance` - ML-based player performance prediction
- `GET /api/player-performance/all_players` - Get all available players

### Player Stats
- `GET /api/player-stats/batters` - Get all batters list
- `GET /api/player-stats/{player_name}` - Get specific player statistics

### Clustering
- `GET /api/clustering/batters` - Get batter clusters
- `GET /api/clustering/bowlers` - Get bowler clusters
- `GET /api/clustering/batters/{player}` - Get specific batter cluster info
- `GET /api/clustering/bowlers/{player}` - Get specific bowler cluster info

### Fantasy Points
- `POST /api/fantasy/estimate` - Estimate fantasy points for team
- `GET /api/fantasy/players` - Get all fantasy players

### System
- `GET /health` - Health check endpoint

## 🚀 Deployment

### 🌐 Live Deployment

The application is currently deployed and operational:

- **Frontend**: [Vercel](https://vercel.com) - `https://in-match-pro.vercel.app`
- **Backend**: [Render](https://render.com) - `https://inmatch-pro-0w31.onrender.com`

### 🏗️ Deployment Architecture

```
┌─────────────────┐    HTTPS    ┌─────────────────┐
│   Vercel        │ ──────────► │   Render        │
│   (Frontend)    │             │   (Backend)     │
│   React + Vite  │             │   FastAPI       │
│                 │             │   + TensorFlow  │
└─────────────────┘             └─────────────────┘
```

### 🔧 Deployment Features

- ✅ **Automatic deployments** from GitHub
- ✅ **HTTPS/SSL** certificates
- ✅ **Global CDN** for fast loading
- ✅ **Environment-based** configurations
- ✅ **Health monitoring** and logging
- ✅ **Scalable infrastructure**

### 📦 Docker Support

The backend includes Docker support for containerized deployment:

```bash
# Build Docker image
docker build -t inmatch-backend ./backend

# Run container
docker run -p 8000:8000 inmatch-backend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- IPL data providers and cricket statistics databases
- Open source community for the amazing tools and libraries
- Cricket analytics community for insights and methodologies

## 📞 Support

For support, questions, or contributions:
- 🌐 **Try the live app**: [https://in-match-pro.vercel.app](https://in-match-pro.vercel.app)
- 📚 **API Documentation**: [https://inmatch-pro-0w31.onrender.com/docs](https://inmatch-pro-0w31.onrender.com/docs)
- 🐛 **Report issues**: Open an issue on GitHub
- 💬 **Discussions**: Use GitHub Discussions for questions

## 🎯 Performance & Monitoring

- **Frontend**: Deployed on Vercel's global edge network
- **Backend**: Running on Render with automatic scaling
- **Uptime**: 99.9% availability target
- **Response Time**: < 2s for API calls
- **ML Predictions**: Real-time TensorFlow inference

---

<div align="center">
  <p>🏏 Built with ❤️ for cricket analytics enthusiasts</p>
  <p>⚡ Powered by AI/ML • 🚀 Deployed on Cloud • 🌐 Available Worldwide</p>

  **[🎯 Try InMatch Pro Live →](https://in-match-pro.vercel.app)**
</div>
