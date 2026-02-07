import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Tooltip,
  IconButton
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

function App() {
  const [attendance, setAttendance] = useState("");
  const [internalMarks, setInternalMarks] = useState("");
  const [previousScore, setPreviousScore] = useState("");
  const [studyHours, setStudyHours] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation function
  const validate = () => {
    const newErrors = {};

    if (attendance === "" || attendance < 0 || attendance > 100) {
      newErrors.attendance = "Attendance must be between 0 and 100";
    }
    if (internalMarks === "" || internalMarks < 0 || internalMarks > 100) {
      newErrors.internalMarks = "Internal marks must be between 0 and 100";
    }
    if (previousScore === "" || previousScore < 0 || previousScore > 100) {
      newErrors.previousScore = "Previous score must be between 0 and 100";
    }
    if (studyHours === "" || studyHours < 0 || studyHours >= 24) {
      newErrors.studyHours = "Study hours must be between 0 and 23";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return; // Stop if validation fails

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("https://student-performance-backend-y5h1.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attendance: Number(attendance),
          internal_marks: Number(internalMarks),
          previous_score: Number(previousScore),
          study_hours: Number(studyHours),
        }),
      });

      const data = await response.json();
      setResult(data.prediction);
    } catch (err) {
      console.error(err);
      setResult("Error predicting!");
    }

    setLoading(false);
  };

  const handleReset = () => {
    setAttendance("");
    setInternalMarks("");
    setPreviousScore("");
    setStudyHours("");
    setResult("");
    setErrors({});
  };

  return (
    <Container>
      <Paper elevation={6} style={{ padding: "30px", maxWidth: "500px", margin: "20px auto" }}>
        <Typography variant="h4" align="center" gutterBottom>
          🎓 Student Performance Prediction
        </Typography>

        <form onSubmit={handleSubmit}>
          <Tooltip title="Enter attendance in percentage (0-100)">
            <TextField
              fullWidth
              label="Attendance (%)"
              type="number"
              margin="normal"
              value={attendance}
              onChange={(e) => setAttendance(e.target.value)}
              error={!!errors.attendance}
              helperText={errors.attendance}
              required
            />
          </Tooltip>

          <Tooltip title="Enter marks obtained in internal assessments (0-100)">
            <TextField
              fullWidth
              label="Internal Marks"
              type="number"
              margin="normal"
              value={internalMarks}
              onChange={(e) => setInternalMarks(e.target.value)}
              error={!!errors.internalMarks}
              helperText={errors.internalMarks}
              required
            />
          </Tooltip>

          <Tooltip title="Enter previous semester score (0-100)">
            <TextField
              fullWidth
              label="Previous Score"
              type="number"
              margin="normal"
              value={previousScore}
              onChange={(e) => setPreviousScore(e.target.value)}
              error={!!errors.previousScore}
              helperText={errors.previousScore}
              required
            />
          </Tooltip>

          <Tooltip title="Average study hours per day (0-23)">
            <TextField
              fullWidth
              label="Study Hours per Day"
              type="number"
              margin="normal"
              value={studyHours}
              onChange={(e) => setStudyHours(e.target.value)}
              error={!!errors.studyHours}
              helperText={errors.studyHours}
              required
            />
          </Tooltip>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<SchoolIcon />}
            style={{ marginTop: "20px" }}
            disabled={loading}
          >
            {loading ? "Predicting..." : "Predict"}
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            startIcon={<RestartAltIcon />}
            style={{ marginTop: "10px" }}
            onClick={handleReset}
          >
            Reset
          </Button>
        </form>

        {result && (
          <Alert
            severity={result === "Pass" ? "success" : "error"}
            style={{ marginTop: "20px", fontWeight: "bold" }}
          >
            Prediction Result: {result}
          </Alert>
        )}
      </Paper>
    </Container>
  );
}

export default App;
