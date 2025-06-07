import { Pool } from 'pg';
import dotenv from 'dotenv';

// Only load .env in dev/test
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing env var: ${key}`);
  return val;
}

export const db = new Pool({
  host: required('POSTGRES_HOST'),
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  user: required('POSTGRES_USER'),
  password: required('POSTGRES_PASSWORD'),
  database: required('POSTGRES_DB'),
});
