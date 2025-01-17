const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const events = require('events');
const app = express();
const path = require('path');


app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? 'your-frontend-domain' 
        : 'http://localhost:5173',
    credentials: true
}));
// Event emitter setup
const statusUpdateEmitter = new events.EventEmitter();
let recentUpdates = [];

// Database connection

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'resource_tracker',
    port: process.env.MYSQL_PORT || 3306,
    ssl: process.env.NODE_ENV === 'production' ? {} : false
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1);
    }
    console.log('Connected to MySQL database');
});

// Resource Routes
app.get('/api/resources', (req, res) => {
    const query = 'SELECT * FROM resources';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/resources', (req, res) => {
    const { name, description, category } = req.body;
    if (!name || !description || !category) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const query = 'INSERT INTO resources (name, description, category) VALUES (?, ?, ?)';
    db.query(query, [name, description, category], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, ...req.body });
    });
});
// Endpoint to fetch recent updates
app.get('/api/resources/updates', (req, res) => {
    res.json(recentUpdates);
});

app.patch('/api/resources/:id', (req, res) => {
    const { status } = req.body;
    const resourceId = req.params.id;

    const validStatuses = ['Available', 'In Use', 'Under Maintenance'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    const query = 'UPDATE resources SET status = ? WHERE id = ?';
    db.query(query, [status, resourceId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        const update = {
            message: `Resource status updated to ${status}`,
            timestamp: new Date(),
            resourceId,
        };
        recentUpdates.unshift(update);
        recentUpdates = recentUpdates.slice(0, 50);
        statusUpdateEmitter.emit('statusUpdate', update);

        res.json({ success: true, update });
    });
});

// SSE Endpoint
app.get('/api/resources/status-stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendUpdate = (update) => {
        res.write(`data: ${JSON.stringify(update)}\n\n`);
    };

    statusUpdateEmitter.on('statusUpdate', sendUpdate);

    req.on('close', () => {
        statusUpdateEmitter.off('statusUpdate', sendUpdate);
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
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/allocations', (req, res) => {
    const { resource_id, project_id, start_date, end_date } = req.body;

    if (!resource_id || !project_id || !start_date || !end_date) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO allocations (resource_id, project_id, start_date, end_date) VALUES (?, ?, ?, ?)';
    db.query(query, [resource_id, project_id, start_date, end_date], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, ...req.body });
    });
});

// Routes for Projects
app.get('/api/projects', (req, res) => {
    const query = 'SELECT * FROM projects';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/projects', (req, res) => {
    const { name, description, start_date, end_date } = req.body;

    if (!name || !description || !start_date || !end_date) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO projects (name, description, start_date, end_date) VALUES (?, ?, ?, ?)';
    db.query(query, [name, description, start_date, end_date], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, ...req.body });
    });
});

// Usage History
app.get('/api/usage-history/:resourceId', (req, res) => {
    const query = 'SELECT * FROM usage_history WHERE resource_id = ? ORDER BY created_at DESC';
    db.query(query, [req.params.resourceId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
