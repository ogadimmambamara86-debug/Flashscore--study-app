# backend/ml/prediction.py
import random

def make_prediction(team_a: str, team_b: str) -> dict:
    # Example dummy logic (replace with real ML model later)
    result = random.choice([team_a, team_b, "Draw"])
    return {
        "team_a": team_a,
        "team_b": team_b,
        "predicted_winner": result
    }