const express = require('express');
const pool = require('./db/init');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/tasks', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error en la DB" });
    }
});

app.post('/api/tasks', async (req, res) => {
    const { title } = req.body;
    try {
        await pool.query('INSERT INTO tasks (title) VALUES (?)', [title]);
        res.status(201).json({ message: 'Creada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/tasks/:id/toggle', async (req, res) => {
    try {
        await pool.query('UPDATE tasks SET completed = NOT completed WHERE id = ?', [req.params.id]);
        res.json({ message: 'Actualizada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
        res.json({ message: 'Eliminada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});