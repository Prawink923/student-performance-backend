from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
from db import get_connection
import os

# -----------------------------
# Load ML model (CORRECT WAY)
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "model.pkl")   # model.pkl is inside backend

model = joblib.load(model_path)

# -----------------------------
# Flask App
# -----------------------------
app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Student Performance Prediction API is running"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    attendance = data["attendance"]
    internal_marks = data["internal_marks"]
    previous_score = data["previous_score"]
    study_hours = data["study_hours"]

    # ML prediction
    features = np.array([[attendance, internal_marks, previous_score, study_hours]])
    prediction = model.predict(features)[0]

    result = "Pass" if prediction == 1 else "Fail"

    # Save to database
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO students
        (attendance, internal_marks, previous_score, study_hours, result)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (attendance, internal_marks, previous_score, study_hours, result)
    )
    conn.commit()
    conn.close()

    return jsonify({"prediction": result})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
