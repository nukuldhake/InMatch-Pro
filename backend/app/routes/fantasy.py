from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from fastapi.responses import JSONResponse
import csv
import os
import joblib

router = APIRouter()

# Load fantasy model and player summary at module load
MODEL_DIR = os.path.join(
    os.path.dirname(__file__), "..", "services", "models"
)
FANTASY_MODEL_PATH = os.path.join(MODEL_DIR, "fantasy_model.pkl")
FANTASY_SUMMARY_PATH = os.path.join(MODEL_DIR, "fantasy_player_summary.pkl")

try:
    fantasy_model = joblib.load(FANTASY_MODEL_PATH)
    player_summary = joblib.load(FANTASY_SUMMARY_PATH)
except Exception as e:
    print(f"Warning: Could not load fantasy models: {e}")
    fantasy_model = None
    player_summary = None

FANTASY_FEATURES = [
    'batsman_runs', 'wickets_taken', 'caught', 'stumped', 'run_out'
]

class PlayerSelection(BaseModel):
    name: str
    captain: Optional[bool] = False
    vice_captain: Optional[bool] = False

class FantasyEstimateInput(BaseModel):
    players: List[PlayerSelection]

class PlayerPrediction(BaseModel):
    name: str
    points: int
    tag: Optional[str] = ""

class FantasyEstimateOutput(BaseModel):
    total_points: int
    captain_bonus: int
    vice_captain_bonus: int
    rank_low: int
    rank_high: int
    individual_preds: List[PlayerPrediction]

@router.post("/estimate", response_model=FantasyEstimateOutput)
def estimate_fantasy_points(input: FantasyEstimateInput):
    team_points = 0
    captain_bonus = 0
    vice_captain_bonus = 0
    individual_preds = []
    for player in input.players:
        row = player_summary[player_summary['player_name'] == player.name]
        if row.empty:
            points = 0
        else:
            input_data = row[FANTASY_FEATURES]
            base_points = fantasy_model.predict(input_data)[0]
            if player.captain:
                points = round(base_points * 1.5)
                captain_bonus += round(base_points * 0.5)
            elif player.vice_captain:
                points = round(base_points * 1.25)
                vice_captain_bonus += round(base_points * 0.25)
            else:
                points = round(base_points)
        tag = "C" if player.captain else ("VC" if player.vice_captain else "")
        individual_preds.append(
            PlayerPrediction(name=player.name, points=points, tag=tag)
        )
        team_points += points

    # Estimate rank range
    total_points = team_points
    if total_points >= 300:
        p_low, p_high = 0.005, 0.015
    elif total_points >= 275:
        p_low, p_high = 0.02, 0.06
    elif total_points >= 250:
        p_low, p_high = 0.08, 0.18
    elif total_points >= 200:
        p_low, p_high = 0.25, 0.45
    elif total_points >= 150:
        p_low, p_high = 0.55, 0.75
    else:
        p_low, p_high = 0.80, 0.95
    total_users = 100000
    rank_low, rank_high = int(total_users * p_low), int(total_users * p_high)

    return FantasyEstimateOutput(
        total_points=team_points,
        captain_bonus=captain_bonus,
        vice_captain_bonus=vice_captain_bonus,
        rank_low=rank_low,
        rank_high=rank_high,
        individual_preds=individual_preds
    )

@router.get("/players", response_class=JSONResponse)
def get_all_player_names():
    base_path = os.path.join(os.path.dirname(__file__), "..", "services", "data")
    files_and_columns = [
        ("batter_stats.csv", 0),  # first column: batter
        ("bowler_clusters.csv", 0),  # first column: player
        ("batter_clusters.csv", 0),  # first column: player
    ]
    names = set()
    for fname, col in files_and_columns:
        fpath = os.path.join(base_path, fname)
        try:
            with open(fpath, encoding="utf-8") as f:
                reader = csv.reader(f)
                next(reader, None)  # skip header
                for row in reader:
                    if row and len(row) > col:
                        names.add(row[col].strip())
        except Exception:
            continue  # skip file if error
    return JSONResponse(content=sorted(names)) 