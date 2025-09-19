CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  company_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS candidates (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  mobile TEXT,
  resume_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);
