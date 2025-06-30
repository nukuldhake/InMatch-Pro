from fastapi import APIRouter, HTTPException, Query
from app.models.players import PlayerBase
from typing import List
import pandas as pd
import os

router = APIRouter()

# Load batter stats at startup
DATA_PATH = os.path.join(os.path.dirname(__file__), '../services/data/batter_stats.csv')
batter_df = pd.read_csv(DATA_PATH)

# Clean column names (strip whitespace)
batter_df.columns = [c.strip() for c in batter_df.columns]

# List of all batters
BATTER_NAMES = batter_df['batter'].dropna().unique().tolist()

# Mock data for demonstration
MOCK_PLAYER_STATS = {
    "Virat Kohli": {
        "matches": 237,
        "runs": 7263,
        "average": 36.32,
        "strike_rate": 130.41,
        "centuries": 7,
        "fifties": 50,
        "recent_form": [45, 67, 12, 89, 34, 78, 23, 56, 91, 8],
    },
    "MS Dhoni": {
        "matches": 250,
        "runs": 5082,
        "average": 39.70,
        "strike_rate": 135.92,
        "centuries": 0,
        "fifties": 24,
        "recent_form": [23, 56, 41, 18, 67, 34, 12, 45, 78, 29],
    },
}
MOCK_PLAYERS = [
    {"id": 1, "name": "Virat Kohli", "team": "RCB", "role": "Batsman"},
    {"id": 2, "name": "MS Dhoni", "team": "CSK", "role": "Wicket-keeper"},
]

@router.get("/batters")
def get_all_batters():
    return {"batters": BATTER_NAMES}

@router.get("/{batter}")
def get_batter_stats(batter: str):
    row = batter_df[batter_df['batter'].str.lower() == batter.lower()]
    if row.empty:
        raise HTTPException(status_code=404, detail="Batter not found")
    r = row.iloc[0]
    # Extract recent scores
    recent_scores = [r[f"m{i}"] for i in range(1, 11) if pd.notnull(r.get(f"m{i}"))]
    # Calculate insights
    average_recent = sum(recent_scores) / len(recent_scores) if recent_scores else 0
    total_recent = sum(recent_scores)
    # Trend: compare first 5 vs last 5
    if len(recent_scores) >= 10:
        first5 = sum(recent_scores[:5])
        last5 = sum(recent_scores[5:])
        if last5 > first5:
            trend = "improving"
        elif last5 < first5:
            trend = "declining"
        else:
            trend = "stable"
    else:
        trend = "unknown"
    # Build response with native Python types
    return {
        "batter": str(r['batter']),
        "total_runs": int(r['total_runs']),
        "total_mat": int(r['total_matches']),
        "balls_faced": int(r['balls_faced']),
        "strike_rate": round(float(r['strike_rate']), 2),
        "highest_run": int(r['highest_run_in_match']),
        "half_centuries": int(r['half_centuries']),
        "centuries": int(r['centuries']),
        "recent_scores": [int(x) for x in recent_scores],
        "average_recent": float(average_recent),
        "total_recent": int(total_recent),
        "trend": str(trend)
    }

@router.get("/{player_name}")
def get_player_stats(player_name: str):
    stats = MOCK_PLAYER_STATS.get(player_name)
    if not stats:
        raise HTTPException(status_code=404, detail="Player not found")
    return stats

@router.get("/players/search")
def search_players(q: str = Query(..., min_length=1)):
    results = [p for p in MOCK_PLAYERS if q.lower() in p["name"].lower()]
    return {"players": results} 