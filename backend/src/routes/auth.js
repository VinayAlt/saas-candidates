// src/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { company_name, email, password } = req.body;
  if (!company_name || !email || !password) return res.status(400).json({ msg: 'missing fields' });

  try {
    const hash = await bcrypt.hash(password, 10);
    const r = await pool.query(
      'INSERT INTO users (company_name, email, password_hash) VALUES ($1,$2,$3) RETURNING id, company_name, email',
      [company_name, email, hash]
    );
    res.json(r.rows[0]);
  } catch (err) {
    console.error('register err', err.message);
    if (err.code === '23505') return res.status(409).json({ msg: 'email already exists' });
    res.status(500).json({ msg: 'error', detail: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ msg: 'missing fields' });

  try {
    const r = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (r.rows.length === 0) return res.status(401).json({ msg: 'invalid credentials' });

    const user = r.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ msg: 'invalid credentials' });

    const token = jwt.sign({ tenant_id: user.id, email: user.email }, process.env.JWT_SECRET || 'verysecret', { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    console.error('login err', err.message);
    res.status(500).json({ msg: 'error' });
  }
});

module.exports = router;
