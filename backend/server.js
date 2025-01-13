// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection for XAMPP
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // default XAMPP username
    password: '',  // default XAMPP password is empty
    database: 'resource_tracker',
    port: 3306     // default XAMPP MySQL port
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Routes for Resources
app.get('/api/resources', (req, res) => {
    const query = 'SELECT * FROM resources';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

app.post('/api/resources', (req, res) => {
    const { name, description, category } = req.body;
    const query = 'INSERT INTO resources (name, description, category) VALUES (?, ?, ?)';
    db.query(query, [name, description, category], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: result.insertId, ...req.body });
    });
});



// Routes for Allocations
app.get('/api/allocations', (req, res) => {
    const query = `
        SELECT a.*, r.name as resource_name, p.name as project_name 
        FROM allocations a 
        JOIN resources r ON a.resource_id = r.id 
        JOIN projects p ON a.project_id = p.id
    `;
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

app.post('/api/allocations', (req, res) => {
    const { resource_id, project_id, start_date, end_date } = req.body;
    const query = 'INSERT INTO allocations (resource_id, project_id, start_date, end_date) VALUES (?, ?, ?, ?)';
    db.query(query, [resource_id, project_id, start_date, end_date], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: result.insertId, ...req.body });
    });
});

// Usage History
app.get('/api/usage-history/:resourceId', (req, res) => {
    const query = 'SELECT * FROM usage_history WHERE resource_id = ? ORDER BY created_at DESC';
    db.query(query, [req.params.resourceId], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));