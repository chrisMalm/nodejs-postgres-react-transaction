import { Pool } from 'pg'
import dotenv from 'dotenv'
dotenv.config()

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'transactions',
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
})
