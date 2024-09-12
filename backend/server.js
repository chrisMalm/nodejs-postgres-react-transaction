const express = require('express');
const cors = require('cors')
const { Pool } = require('pg');

const app = express();
const port = 5000;
app.use(cors());

// PostgreSQL connection setup
const pool = new Pool({
  user: 'postgres', // your PostgreSQL username
  host: 'localhost',
  database: 'transactions', // your database name
  password: '!12TreFyra', // your PostgreSQL password
  port: 5432, // PostgreSQL port
});

// Route to get all transactions
app.get('/transactions', async (req, res) => {
  console.log('GET /transactions endpoint hit'); // Log when the endpoint is hit

  try {
    const result = await pool.query('SELECT * FROM transactions');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

