const express = require('express');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../db.json');
const app = express();
app.use(express.json());

// Improved readDatabase function
const readDatabase = () => {
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error('Database file not found. Returning an empty array.');
            fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
            return [];
        } else if (error instanceof SyntaxError) {
            console.error('Malformed JSON in db.json. Resetting to an empty array.');
            fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
            return [];
        } else {
            throw error;
        }
    }
};
const writeDatabase = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

app.get('/courses', (req, res) => {
    const courses = readDatabase();
    res.json(courses);
});

app.post('/courses', (req, res) => {
    const courses = readDatabase();
    const newCourse = req.body;
    courses.push(newCourse);
    writeDatabase(courses);
    res.status(201).json({ message: 'Course added successfully!' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
