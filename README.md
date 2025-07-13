# InMatch Pro - IPL Strategy Assistant

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/FastAPI-Latest-green?style=for-the-badge&logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/TypeScript-5.5.3-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Python-3.8+-yellow?style=for-the-badge&logo=python" alt="Python">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.11-blue?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS">
</div>

## 🏏 Overview

**InMatch Pro** is an advanced AI-powered cricket analytics platform specifically designed for the Indian Premier League (IPL). It provides real-time match predictions, comprehensive player analytics, and strategic insights using cutting-edge machine learning models.

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

### Prerequisites

- **Node.js** (v16+ recommended)
- **Python** (3.8+ required)
- **npm** or **yarn** for frontend dependencies
- **pip** for Python dependencies

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd InMatch-Pro
```

### 2. Backend Setup

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

### 3. Frontend Setup

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
- **Pydantic** - Data validation using Python type annotations
- **Pandas** - Data manipulation and analysis
- **Scikit-learn** - Machine learning library
- **TensorFlow** - Deep learning framework
- **Uvicorn** - ASGI server for FastAPI
- **Python-multipart** - File upload support
- **HTTPX** - Async HTTP client
- **Loguru** - Advanced logging

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

### Live Match Prediction
- `POST /api/live-match/predict` - Predict match outcome

### Player Performance
- `POST /api/player-performance/predict` - Predict player performance

### Player Stats
- `GET /api/player-stats/search` - Search player statistics
- `GET /api/player-stats/{player_id}` - Get specific player stats

### Clustering
- `GET /api/clustering/players` - Get player clusters
- `POST /api/clustering/similar` - Find similar players

### Fantasy Points
- `POST /api/fantasy/estimate` - Estimate fantasy points
- `GET /api/fantasy/recommendations` - Get team recommendations

## 🚀 Deployment

### Frontend Deployment
The frontend can be deployed to any static hosting service:

```bash
cd frontend
npm run build
# Deploy the 'dist' folder to Vercel, Netlify, GitHub Pages, etc.
```

### Backend Deployment
The FastAPI backend can be deployed to cloud platforms:

```bash
# For production, use a production ASGI server
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
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
- Open an issue on GitHub
- Contact the development team
- Check the documentation in `/docs` (if available)

---

<div align="center">
  <p>Built with ❤️ for cricket analytics enthusiasts</p>
</div>
