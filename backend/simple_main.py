import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

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
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "InMatch Pro API is running!", "environment": ENVIRONMENT}

@app.get("/health")
def health_check():
    return {"status": "ok", "environment": ENVIRONMENT}

@app.get("/api/test")
def test_endpoint():
    return {"message": "API is working!", "status": "success"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
