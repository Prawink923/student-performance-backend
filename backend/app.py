from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os
from db import get_connection

app = Flask(__name__)
CORS(app)

# Load model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "ml_model", "model.pkl")
model = joblib.load(model_path)

@app.route("/")
def home():
    return "Student Performance Prediction API is running"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    features = np.array([[
        data["attendance"],
        data["internal_marks"],
        data["previous_score"],
        data["study_hours"]
    ]])

    prediction = model.predict(features)[0]
    result = "Pass" if prediction == 1 else "Fail"

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO students
        (attendance, internal_marks, previous_score, study_hours, result)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (
            data["attendance"],
            data["internal_marks"],
            data["previous_score"],
            data["study_hours"],
            result
        )
    )
    conn.commit()
    conn.close()

    return jsonify({"prediction": result})

if __name__ == "__main__":
    app.run()
