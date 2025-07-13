from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import joblib
import pandas as pd
import os

router = APIRouter()

# Load models and summaries once at startup
BASE_PATH = os.path.dirname(os.path.abspath(__file__))
MODELS_PATH = os.path.join(BASE_PATH, "../services/models")

try:
    batter_model = joblib.load(os.path.join(MODELS_PATH, "batter_model.pkl"))
    bowler_model = joblib.load(os.path.join(MODELS_PATH, "bowler_model.pkl"))
    batter_summary = joblib.load(os.path.join(MODELS_PATH, "batter_summary.pkl"))
    bowler_summary = joblib.load(os.path.join(MODELS_PATH, "bowler_summary.pkl"))
except Exception as e:
    print(f"Warning: Could not load player performance models: {e}")
    batter_model = None
    bowler_model = None
    batter_summary = None
    bowler_summary = None

class PlayerIn(BaseModel):
    name: str
    team: str
    role: str

class PlayerPrediction(BaseModel):
    name: str
    team: str
    role: str
    predicted_runs: int
    predicted_wickets: int

class TeamPrediction(BaseModel):
    total_runs: int
    total_wickets: int
    best_performer: str

class PredictionResponse(BaseModel):
    predictions: List[PlayerPrediction]
    team_summary: TeamPrediction

@router.post("/predict_player_performance", response_model=PredictionResponse)
def predict_player_performance(players: List[PlayerIn]):
    predictions = []
    for player in players:
        # Lookup stats
        bat_row = batter_summary[batter_summary['batter'] == player.name]
        bowl_row = bowler_summary[bowler_summary['bowler'] == player.name]
        total_runs = bat_row['total_runs'].values[0] if not bat_row.empty else 0
        strike_rate = bat_row['strike_rate'].values[0] if not bat_row.empty else 100.0
        total_wickets = bowl_row['total_wickets'].values[0] if not bowl_row.empty else 0
        economy = bowl_row['economy'].values[0] if not bowl_row.empty else 8.0

        # Predict
        predicted_runs = 0
        predicted_wickets = 0
        if player.role in ['Batsman', 'All-rounder', 'Wicket-keeper']:
            bat_input = pd.DataFrame([[total_runs, strike_rate]], columns=['total_runs', 'strike_rate'])
            predicted_runs = int(round(batter_model.predict(bat_input)[0]))
        if player.role in ['Bowler', 'All-rounder']:
            bowl_input = pd.DataFrame([[total_wickets, economy]], columns=['total_wickets', 'economy'])
            predicted_wickets = int(round(bowler_model.predict(bowl_input)[0]))

        predictions.append({
            "name": player.name,
            "team": player.team,
            "role": player.role,
            "predicted_runs": predicted_runs,
            "predicted_wickets": predicted_wickets
        })

    # Team summary
    total_runs = sum(p["predicted_runs"] for p in predictions)
    total_wickets = sum(p["predicted_wickets"] for p in predictions)
    best_performer = max(predictions, key=lambda p: p["predicted_runs"])['name'] if predictions else ""

    return {
        "predictions": predictions,
        "team_summary": {
            "total_runs": total_runs,
            "total_wickets": total_wickets,
            "best_performer": best_performer
        }
    }

@router.get("/all_players")
def get_all_players():
    batter_names = set(batter_summary['batter'].unique())
    bowler_names = set(bowler_summary['bowler'].unique())
    all_names = sorted(batter_names | bowler_names)
    return {"players": list(all_names)}

@router.get("/player_info/{name}")
def get_player_info(name: str):
    bat_row = batter_summary[batter_summary['batter'] == name]
    bowl_row = bowler_summary[bowler_summary['bowler'] == name]

    is_batter = not bat_row.empty and bat_row['total_runs'].values[0] > 0
    is_bowler = not bowl_row.empty and bowl_row['total_wickets'].values[0] > 0

    if is_batter and is_bowler:
        role = "All-rounder"
    elif is_batter:
        role = "Batsman"
    elif is_bowler:
        role = "Bowler"
    else:
        role = ""

    return {
        "name": name,
        "role": role,
        "team": ""
    } 