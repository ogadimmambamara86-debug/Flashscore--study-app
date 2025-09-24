# backend/ml/prediction.py
from fastapi import FastAPI
import random

app = FastAPI(title="ML Prediction API")

@app.get("/predict")
def predict(team_a: str, team_b: str):
    result = random.choice([team_a, team_b, "Draw"])
    return {
        "team_a": team_a,
        "team_b": team_b,
        "predicted_winner": result
    }