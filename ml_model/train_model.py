import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle

# Load dataset
data = pd.read_csv("dataset.csv")

# Features and target
X = data[['attendance', 'internal_marks', 'previous_score', 'study_hours']]
y = data['result']  # should be 'Pass'/'Fail'

# Encode target if necessary
y = y.map({'Fail': 0, 'Pass': 1})  # 0 = Fail, 1 = Pass

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model
with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

# Test accuracy
print("Model accuracy:", model.score(X_test, y_test))
