CREATE DATABASE IF NOT EXISTS studentdb;
USE studentdb;

CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attendance INT NOT NULL,
    internal_marks INT NOT NULL,
    previous_score INT NOT NULL,
    study_hours INT NOT NULL,
    result VARCHAR(10) NOT NULL
);
