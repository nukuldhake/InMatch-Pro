from pydantic import BaseModel
from typing import List, Optional

class PlayerPrediction(BaseModel):
    id: int
    name: str
    predicted_runs: int
    predicted_wickets: int
    fantasy_points: int 