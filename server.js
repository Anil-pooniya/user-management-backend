const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to SQLite Database
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) console.error(err.message);
    else console.log("Connected to SQLite database");
});

// Create users table
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    address TEXT NOT NULL,
    location TEXT NOT NULL
)`);

// API to add user
app.post('/save-user', (req, res) => {
    const { name, mobile, address, location } = req.body;
    db.run(`INSERT INTO users (name, mobile, address, location) VALUES (?, ?, ?, ?)`, 
        [name, mobile, address, location],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "User saved", id: this.lastID });
        });
});

// API to get users
app.get('/get-users', (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
