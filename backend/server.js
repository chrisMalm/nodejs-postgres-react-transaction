const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const app = express()
const port = 5000
app.use(cors())

// PostgreSQL connection setup
const pool = new Pool({
  user: 'postgres', // your PostgreSQL username
  host: 'localhost',
  database: 'transactions', // your database name
  password: '!12TreFyra', // your PostgreSQL password
  port: 5432, // PostgreSQL port
})

app.use(express.json())

// Route to get User
app.post('/login', async (req, res) => {
  const { userName, password } = req.body

  try {
    const query = 'SELECT id, name, password FROM users WHERE name = $1'
    const result = await pool.query(query, [userName])
    // Check if a user was found
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }
    const user = result.rows[0]
    const isPasswordValid = await bcrypt.compare(password, user.password) // Compare hashed password
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }
    // Send back the token and user data (excluding the password)

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name },

      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expiration time
    )

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name },
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// Get User transactions
app.get('/userTransacations/:id', async (req, res) => {
  const { id } = req.params // Extract user ID from the URL

  try {
    const query = 'SELECT * FROM transactions WHERE user_id = $1' // Assuming 'user_id' is the foreign key in the transactions table
    const result = await pool.query(query, [id])

    // Check if transactions were found
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: 'No transactions found for this user' })
    }

    res.json(result.rows) // Send the transactions as a response
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// Update balance user account and also update transactions table

app.put('/userTransaction', async (req, res) => {
  const { amount, userId } = req.body
  try {
    // select account with userid and get that value
    const getBalanceQuery =
      'SELECT balance FROM bank_balances WHERE user_id = $1'
    const balanceResult = await pool.query(getBalanceQuery, [userId])

    // Check if the user exists in the bank_balances table
    if (balanceResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    let currentBalance = parseFloat(balanceResult.rows[0].balance)
    const transactionAmount = parseFloat(amount)

    // 2. Update the balance
    const newBalance = currentBalance + transactionAmount

    // 3. Update the balance in the bank_balances table
    const updateBalanceQuery =
      'UPDATE bank_balances SET balance = $1 WHERE user_id = $2'
    await pool.query(updateBalanceQuery, [newBalance, userId])

    // 4. Insert the new transaction into the history_transactions table
    const insertTransactionQuery = `
          INSERT INTO transactions (user_id, amount, transaction_date)
          VALUES ($1, $2, NOW())
          RETURNING transaction_date
        `
    const transactionResult = await pool.query(insertTransactionQuery, [
      userId,
      transactionAmount,
    ])

    const transactionDate = transactionResult.rows[0].transaction_date

    // 5. Return the updated balance and transaction date

    res.json({
      balance: newBalance,
      transaction_date: transactionDate,
    })
  } catch (err) {
    console.error('Error processing transaction:', err.message)
    res.status(500).send('Server error')
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
