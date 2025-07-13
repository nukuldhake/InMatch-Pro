import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routes import (
    live_match,
    player_performance,
    player_stats,
    clustering,
    fantasy,
)

# Load environment variables
load_dotenv()

# Configuration
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:8080,http://localhost:3000"
).split(",")

app = FastAPI(
    title="InMatch Pro API",
    version="1.0.0",
    description="AI-powered cricket analytics platform for IPL",
    docs_url="/docs" if ENVIRONMENT == "development" else None,
    redoc_url="/redoc" if ENVIRONMENT == "development" else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all route modules
app.include_router(
    live_match.router,
    prefix="/api/live-match",
    tags=["Live Match"]
)
app.include_router(
    player_performance.router,
    prefix="/api/player-performance",
    tags=["Player Performance"],
)
app.include_router(
    player_stats.router,
    prefix="/api/player-stats",
    tags=["Player Stats"],
)
app.include_router(
    clustering.router,
    prefix="/api/clustering",
    tags=["Clustering"],
)
app.include_router(
    fantasy.router,
    prefix="/api/fantasy",
    tags=["Fantasy"],
)


@app.get("/health", tags=["Health"])
def health_check():
    import sys
    return {
        "status": "ok",
        "environment": ENVIRONMENT,
        "python_version": sys.version,
        "python_version_info": f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    }