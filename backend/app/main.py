from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import (
    live_match,
    player_performance,
    player_stats,
    clustering,
    fantasy,
)

app = FastAPI(title="InMatch Pro API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all route modules
app.include_router(live_match.router, prefix="/api/live-match", tags=["Live Match"])
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
    return {"status": "ok"} 