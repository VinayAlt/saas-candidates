const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.username,         // matches secret
  password: process.env.password,     // matches secret
  host: process.env.host,             // matches secret
  port: 5432,                         // RDS default
  database: process.env.dbname,       // matches secret
  ssl: { rejectUnauthorized: false }, // required for AWS RDS
});

module.exports = pool;


