// src/index.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pool = require('./db');

// Ensure uploads folder exists (local fallback)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Run DB migrations (simple)
const initPath = path.join(__dirname, '..', 'migrations', 'init.sql');
if (fs.existsSync(initPath)) {
  const initSql = fs.readFileSync(initPath, 'utf8');
  (async () => {
    try {
      await pool.query(initSql);
      console.log('DB migration applied');
    } catch (err) {
      console.error('DB migration error:', err.message);
    }
  })();
}

app.get('/healthz', (req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/candidates', require('./routes/candidates'));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend running on http://0.0.0.0:${port}`));
