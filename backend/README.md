# InMatch Pro - IPL Strategy Assistant Backend

This is the FastAPI backend for the InMatch Pro IPL Strategy Assistant. It provides machine learning-powered cricket analytics and prediction APIs for the React frontend.

## Features
- Live match prediction
- Player performance prediction
- Player stats lookup
- Player clustering
- Fantasy points estimation

## Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── predictions.py
│   │   ├── players.py
│   │   └── matches.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── live_match.py
│   │   ├── player_performance.py
│   │   ├── player_stats.py
│   │   ├── clustering.py
│   │   ├── fantasy.py
│   │   └── mvp.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ml_models.py
│   │   └── data_processor.py
│   └── data/
│       ├── ipl_teams.json
│       ├── players.json
│       └── historical_matches.json
├── requirements.txt
└── README.md
```

## Setup Instructions

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
2. **Run the server:**
   ```bash
   uvicorn app.main:app --reload
   ```
3. **API Docs:**
   Visit [http://localhost:8000/docs](http://localhost:8000/docs) for interactive API documentation.

## Tech Stack
- FastAPI
- Pydantic
- Pandas
- Scikit-learn
- SQLite/JSON for data
- CORS enabled for frontend

## License
MIT 