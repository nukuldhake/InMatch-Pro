from fastapi import APIRouter, HTTPException
from app.models.matches import LiveMatchInput, LiveMatchOutput
from app.services.ml_models import predict_innings_score, score_model, score_scaler

router = APIRouter()

@router.post("/predict", response_model=LiveMatchOutput)
def predict_live_match(input: LiveMatchInput):
    try:
        features = input.dict()
        predicted_score, win_probability, certainty, input_used = predict_innings_score(features)
        return LiveMatchOutput(
            predicted_score=predicted_score,
            win_probability_team1=win_probability,
            win_probability_team2=1 - win_probability,
            certainty=certainty,
            input_used=input_used
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/model-health")
def model_health():
    return {
        "score_model_loaded": score_model is not None,
        "score_scaler_loaded": score_scaler is not None
    } 