import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER || 'igoroganesian',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'sketchtracker',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export default pool;
