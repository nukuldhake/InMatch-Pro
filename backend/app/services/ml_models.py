import os
import joblib
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import StandardScaler

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "ipl_match_winner_model.pkl")
LE_DICT_PATH = os.path.join(MODEL_DIR, "label_encoder_dict.pkl")
LABEL_ENCODER_PATH = os.path.join(MODEL_DIR, "label_encoder_target.pkl")
LIVE_MATCH_MODEL_DIR = os.path.join(MODEL_DIR, "live_match_predictor")
SCORE_MODEL_PATH = os.path.join(LIVE_MATCH_MODEL_DIR, "ipl_score_predictor_model.h5")
SCALER_PATH = os.path.join(LIVE_MATCH_MODEL_DIR, "score_scaler.pkl")  # Assume scaler is saved here
FEATURE_COLUMNS_PATH = os.path.join(LIVE_MATCH_MODEL_DIR, "score_feature_columns.pkl")

# Load model and encoders at module load
def _load_model_and_encoders():
    try:
        model = joblib.load(MODEL_PATH)
        le_dict = joblib.load(LE_DICT_PATH)
        label_encoder = joblib.load(LABEL_ENCODER_PATH)
        return model, le_dict, label_encoder
    except Exception as e:
        print(f"Warning: Could not load match winner models: {e}")
        return None, None, None

best_model, le_dict, label_encoder = _load_model_and_encoders()

# Load Keras model and scaler at module load (if available)
def _load_score_model_and_scaler():
    model = tf.keras.models.load_model(SCORE_MODEL_PATH, compile=False)
    scaler = joblib.load(SCALER_PATH)
    return model, scaler

try:
    score_model, score_scaler = _load_score_model_and_scaler()
    print("Score model loaded:", score_model is not None)
    print("Score scaler loaded:", score_scaler is not None)
except Exception as e:
    print("MODEL/SCALER LOAD ERROR:", e)
    score_model, score_scaler = None, None

try:
    feature_columns = joblib.load(FEATURE_COLUMNS_PATH)
except Exception as e:
    print(f"Warning: Could not load feature columns: {e}")
    feature_columns = []

# List of all possible teams and venues for one-hot encoding (should match training)
ALL_TEAMS = [
    'Chennai Super Kings', 'Delhi Capitals', 'Kings XI Punjab', 'Kolkata Knight Riders',
    'Mumbai Indians', 'Rajasthan Royals', 'Royal Challengers Bangalore', 'Sunrisers Hyderabad',
    'Gujarat Titans', 'Lucknow Super Giants', 'Punjab Kings', 'Rising Pune Supergiant',
    'Rising Pune Supergiants', 'Gujarat Lions', 'Delhi Daredevils'
]
ALL_VENUES = [
    "Arun Jaitley Stadium",
    "Arun Jaitley Stadium, Delhi",
    "Barabati Stadium",
    "Barsapara Cricket Stadium, Guwahati",
    "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow",
    "Brabourne Stadium",
    "Brabourne Stadium, Mumbai",
    "Buffalo Park",
    "De Beers Diamond Oval",
    "Dr DY Patil Sports Academy",
    "Dr DY Patil Sports Academy, Mumbai",
    "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium",
    "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium, Visakhapatnam",
    "Dubai International Cricket Stadium",
    "Eden Gardens",
    "Eden Gardens, Kolkata",
    "Feroz Shah Kotla",
    "Green Park",
    "Himachal Pradesh Cricket Association Stadium",
    "Himachal Pradesh Cricket Association Stadium, Dharamsala",
    "Holkar Cricket Stadium",
    "JSCA International Stadium Complex",
    "Kingsmead",
    "M Chinnaswamy Stadium",
    "M Chinnaswamy Stadium, Bengaluru",
    "M.Chinnaswamy Stadium",
    "MA Chidambaram Stadium",
    "MA Chidambaram Stadium, Chepauk",
    "MA Chidambaram Stadium, Chepauk, Chennai",
    "Maharaja Yadavindra Singh International Cricket Stadium, Mullanpur",
    "Maharashtra Cricket Association Stadium",
    "Maharashtra Cricket Association Stadium, Pune",
    "Narendra Modi Stadium, Ahmedabad",
    "Nehru Stadium",
    "New Wanderers Stadium",
    "Newlands",
    "OUTsurance Oval",
    "Punjab Cricket Association IS Bindra Stadium",
    "Punjab Cricket Association IS Bindra Stadium, Mohali",
    "Punjab Cricket Association IS Bindra Stadium, Mohali, Chandigarh",
    "Punjab Cricket Association Stadium, Mohali",
    "Rajiv Gandhi International Stadium",
    "Rajiv Gandhi International Stadium, Uppal",
    "Rajiv Gandhi International Stadium, Uppal, Hyderabad",
    "Sardar Patel Stadium, Motera",
    "Saurashtra Cricket Association Stadium",
    "Sawai Mansingh Stadium",
    "Sawai Mansingh Stadium, Jaipur",
    "Shaheed Veer Narayan Singh International Stadium",
    "Sharjah Cricket Stadium",
    "Sheikh Zayed Stadium",
    "St George's Park",
    "Subrata Roy Sahara Stadium",
    "SuperSport Park",
    "Vidarbha Cricket Association Stadium, Jamtha",
    "Wankhede Stadium",
    "Wankhede Stadium, Mumbai",
    "Zayed Cricket Stadium, Abu Dhabi"
]

def preprocess_score_features(features: dict):
    # Compute derived features
    ball_no = features['over'] * 6 + features['ball']
    balls_remaining = 120 - ball_no
    run_rate = features['current_score'] / (ball_no / 6) if ball_no > 0 else 0

    # Compute required_run_rate (if 'target' is provided)
    if 'target' in features and features['target'] is not None:
        runs_required = features['target'] - features['current_score']
        required_run_rate = runs_required / (balls_remaining / 6) if balls_remaining > 0 else 0
    else:
        required_run_rate = 0

    # Build the row to match the notebook model
    row = {}
    for team in ALL_TEAMS[1:]:  # drop_first=True in get_dummies
        row[f'batting_team_{team}'] = 1 if features['batting_team'] == team else 0
    for team in ALL_TEAMS[1:]:
        row[f'bowling_team_{team}'] = 1 if features['bowling_team'] == team else 0
    for venue in ALL_VENUES[1:]:
        row[f'venue_{venue}'] = 1 if features['venue'] == venue else 0
    # Add numeric and derived features
    row['current_score'] = features['current_score']
    row['wickets'] = features['wickets']
    row['runs_last_5'] = features['runs_last_5']
    row['balls_remaining'] = balls_remaining
    row['run_rate'] = run_rate
    row['required_run_rate'] = required_run_rate

    # Convert to DataFrame
    X = pd.DataFrame([row])
    # Scale numeric columns
    num_cols = ['current_score', 'wickets', 'runs_last_5', 'balls_remaining', 'run_rate', 'required_run_rate']
    X[num_cols] = score_scaler.transform(X[num_cols])
    # Align columns to match training
    X = X.reindex(columns=feature_columns, fill_value=0)
    return X

def get_certainty(prob):
    if prob > 0.8 or prob < 0.2:
        return "high"
    elif 0.6 < prob < 0.8 or 0.2 < prob < 0.4:
        return "medium"
    else:
        return "low"

def predict_innings_score(features: dict):
    if score_model is None or score_scaler is None:
        raise RuntimeError("Score prediction model or scaler not loaded.")
    X = preprocess_score_features(features)
    score_pred, win_prob = score_model.predict(X)
    predicted_score = int(round(score_pred[0][0]))
    win_probability = float(win_prob[0][0])
    certainty = get_certainty(win_probability)
    return predicted_score, win_probability, certainty, features

def predict_match_winner(match_features: dict):
    """
    Predicts the winner of an IPL match given match features.
    Args:
        match_features (dict): Dictionary with keys: team1, team2, venue, toss_winner, toss_decision,
                               team1_form, team2_form, venue_win_ratio_team1, venue_win_ratio_team2, head_to_head_ratio
    Returns:
        dict: {predicted_winner, confidence, team_probabilities}
    """
    # Convert to DataFrame
    new_df = pd.DataFrame([match_features])
    # Encode categorical values
    for col in ['team1', 'team2', 'venue', 'toss_winner']:
        if col in le_dict and new_df[col].iloc[0] in le_dict[col].classes_:
            new_df[col] = le_dict[col].transform(new_df[col])
        else:
            raise ValueError(f"Unknown value in {col}: {new_df[col].iloc[0]}")
    # Encode toss_decision manually
    new_df['toss_decision'] = 0 if new_df['toss_decision'].iloc[0] == 'bat' else 1
    # Prepare input for model
    X = new_df.values
    # Predict probabilities
    probs = best_model.predict_proba(X)[0]
    pred_class = np.argmax(probs)
    confidence = float(probs[pred_class]) * 100
    predicted_winner = label_encoder.inverse_transform([pred_class])[0]
    team_probs = {label_encoder.inverse_transform([i])[0]: float(prob) for i, prob in enumerate(probs)}
    return {
        "predicted_winner": predicted_winner,
        "confidence": confidence,
        "team_probabilities": team_probs
    } 