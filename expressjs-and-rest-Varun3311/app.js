const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors()); 
app.use(express.json());
// Database setup
const dbPath = path.resolve(__dirname, 'students.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Error opening DB:', err.message);
  else console.log('Connected to students.db');
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      favoriteColor TEXT,
      favoriteFood TEXT,
      likes INTEGER DEFAULT 0
    )
  `);
});

// GET all students.
app.get('/api/profiles', (req, res) => {
  db.all('SELECT * FROM students', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
});

// GET one student.
app.get('/api/profiles/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Student not found' });
    res.status(200).json(row);
  });
});

// POST - Create new student
app.post('/api/profiles', (req, res) => {
  const { name, favoriteColor, favoriteFood } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  db.run(
    'INSERT INTO students (name, favoriteColor, favoriteFood) VALUES (?, ?, ?)',
    [name, favoriteColor, favoriteFood],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

// PUT - Replace student data
app.put('/api/profiles/:id', (req, res) => {
  const { id } = req.params;
  const { name, favoriteColor, favoriteFood, likes } = req.body;
  db.run(
    'UPDATE students SET name = ?, favoriteColor = ?, favoriteFood = ?, likes = ? WHERE id = ?',
    [name, favoriteColor, favoriteFood, likes, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Student not found' });
      res.status(200).json({ message: 'Student updated' });
    }
  );
});

// PATCH - Increment likes
app.patch('/api/profiles/:id/likes', (req, res) => {
  const { id } = req.params;
  db.run(
    'UPDATE students SET likes = likes + 1 WHERE id = ?',
    [id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Student not found' });
      res.status(200).json({ message: 'Like incremented' });
    }
  );
});

// DELETE - Remove student
app.delete('/api/profiles/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM students WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Student not found' });
    res.status(200).json({ message: 'Student deleted' });
  });
});

module.exports = app;
