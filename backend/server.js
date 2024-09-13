const express = require('express');
const cors = require('cors')
const { Pool } = require('pg');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

app.use(express.json()); 

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

// Route to get User 
app.post('/login', async (req, res) => {
  console.log('fetch user'); 
  
  const { userName, password } = req.body
  console.log('Username from request:', userName);
  console.log('Password from request:', password);
  try {
    const query = 'SELECT id, name, password FROM users WHERE name = $1';
    const result = await pool.query(query, [userName]);
      // Check if a user was found
      if (result.rows.length === 0) {
        console.log("hej2");
        
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      const user = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password); // Compare hashed password
      if (!isPasswordValid) {

        console.log("dkkldjwld");
        
        return res.status(401).json({ message: 'Invalid username or password' });
      }
       // Send back the token and user data (excluding the password)
       console.log(res.json, "response");

         // Generate JWT token
         console.log(process.env.JWT_SECRET, "jwt secret");
    const token = jwt.sign(
      { id: user.id, name: user.name },
      
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expiration time
    );
       
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// User transactions 
app.get("/userTransacations/:id", async (req, res) => {
  console.log("fetch all transactions for a user");
  const { id } = req.params; // Extract user ID from the URL
  console.log(id, "id från params");
  
  try {
    const query = 'SELECT * FROM transactions WHERE user_id = $1'; // Assuming 'user_id' is the foreign key in the transactions table
    const result = await pool.query(query, [id]);

    // Check if transactions were found
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No transactions found for this user' });
    }

    res.json(result.rows); // Send the transactions as a response
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

