from pydantic import BaseModel
from typing import Optional

class MatchConditions(BaseModel):
    venue: str
    team1: str
    team2: str
    pitch_type: Optional[str] = "balanced"

class LiveMatchInput(BaseModel):
    batting_team: str
    bowling_team: str
    venue: str
    over: int
    ball: int
    current_score: int
    wickets: int
    runs_last_5: int
    target: Optional[int] = None

class LiveMatchOutput(BaseModel):
    predicted_score: int
    win_probability_team1: float
    win_probability_team2: float
    certainty: str
    input_used: dict 