// src/routes/candidates.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../db');
const jwt = require('jsonwebtoken');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const router = express.Router();

// S3 client — SDK will use env creds or IRSA on EKS
const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const S3_BUCKET = process.env.S3_BUCKET;

// multer memory storage for file buffer
const upload = multer({ storage: multer.memoryStorage() });

function auth(req, res, next) {
  const h = req.headers['authorization'] || '';
  const token = h.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'no token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'verysecret');
    req.tenant_id = payload.tenant_id;
    next();
  } catch (e) {
    return res.status(401).json({ msg: 'invalid token' });
  }
}

// Create candidate with optional resume upload
router.post('/', auth, upload.single('resume'), async (req, res) => {
  const { first_name, last_name, email, mobile } = req.body;
  if (!first_name || !last_name) return res.status(400).json({ msg: 'missing name' });

  let resume_url = null;

  if (req.file && S3_BUCKET) {
    const key = `resumes/${req.tenant_id}/${Date.now()}-${req.file.originalname}`.replace(/\s+/g, '_');
    try {
      await s3.send(new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
      }));
      const region = process.env.AWS_REGION || 'us-east-1';
      resume_url = `https://${S3_BUCKET}.s3.${region}.amazonaws.com/${key}`;
    } catch (e) {
      console.error('S3 upload error', e.message);
      return res.status(500).json({ msg: 's3 upload failed' });
    }
  } else if (req.file) {
    // Local fallback (dev)
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const filename = `${Date.now()}-${req.file.originalname}`.replace(/\s+/g, '_');
    const dest = path.join(uploadsDir, filename);
    try {
      require('fs').writeFileSync(dest, req.file.buffer);
      resume_url = `/uploads/${filename}`;
    } catch (e) {
      console.error('local save error', e.message);
      return res.status(500).json({ msg: 'file save failed' });
    }
  }

  try {
    const q = await pool.query(
      'INSERT INTO candidates (tenant_id, first_name, last_name, email, mobile, resume_url) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
      [req.tenant_id, first_name, last_name, email || null, mobile || null, resume_url]
    );
    res.json({ id: q.rows[0].id, resume_url });
  } catch (e) {
    console.error('db insert error', e.message);
    res.status(500).json({ msg: 'db error' });
  }
});

// List candidates for tenant
router.get('/', auth, async (req, res) => {
  try {
    const q = await pool.query('SELECT id, first_name, last_name, email, mobile, resume_url, created_at FROM candidates WHERE tenant_id=$1 ORDER BY created_at DESC', [req.tenant_id]);
    res.json(q.rows);
  } catch (e) {
    console.error('db list error', e.message);
    res.status(500).json({ msg: 'db error' });
  }
});

// Get single candidate
router.get('/:id', auth, async (req, res) => {
  try {
    const q = await pool.query('SELECT * FROM candidates WHERE id=$1 AND tenant_id=$2', [req.params.id, req.tenant_id]);
    if (q.rows.length === 0) return res.status(404).json({ msg: 'not found' });
    res.json(q.rows[0]);
  } catch (e) {
    console.error('db get error', e.message);
    res.status(500).json({ msg: 'db error' });
  }
});

// Update candidate
router.put('/:id', auth, async (req, res) => {
  const { first_name, last_name, email, mobile } = req.body;
  try {
    await pool.query('UPDATE candidates SET first_name=$1, last_name=$2, email=$3, mobile=$4 WHERE id=$5 AND tenant_id=$6', [first_name, last_name, email, mobile, req.params.id, req.tenant_id]);
    res.json({ msg: 'ok' });
  } catch (e) {
    console.error('db update error', e.message);
    res.status(500).json({ msg: 'db error' });
  }
});

// Delete candidate
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM candidates WHERE id=$1 AND tenant_id=$2', [req.params.id, req.tenant_id]);
    res.json({ msg: 'deleted' });
  } catch (e) {
    console.error('db delete error', e.message);
    res.status(500).json({ msg: 'db error' });
  }
});

module.exports = router;
