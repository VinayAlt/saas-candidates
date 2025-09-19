// src/db.js
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@db:5432/saasdb';

// Pool will automatically pick up environment variables and is safe to use.
const pool = new Pool({ connectionString });

module.exports = pool;
