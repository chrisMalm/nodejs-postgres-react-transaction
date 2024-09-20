import { Router } from 'express'
import { pool } from '../db/pool'

const router = Router()

// Get User transactions
router.get('/userTransacations/:id', async (req, res) => {
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

    const sortedArray = result.rows
      .sort((a, b) => a.transaction_date - b.transaction_date)
      .reverse()

    res.json(sortedArray) // Send the transactions as a response
  } catch (err: any) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// Update balance and transaction
router.put('/userTransaction', async (req, res) => {
  const { amount, userId } = req.body
  try {
    const getBalanceQuery =
      'SELECT balance FROM bank_balances WHERE user_id = $1'
    const balanceResult = await pool.query(getBalanceQuery, [userId])

    if (balanceResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    let currentBalance = parseFloat(balanceResult.rows[0].balance)
    const transactionAmount = parseFloat(amount)
    const newBalance = currentBalance + transactionAmount

    const updateBalanceQuery =
      'UPDATE bank_balances SET balance = $1 WHERE user_id = $2'
    await pool.query(updateBalanceQuery, [newBalance, userId])

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

    res.json({
      balance: newBalance,
      transaction_date: transactionDate,
    })
  } catch (err: any) {
    console.error('Error processing transaction:', err.message)
    res.status(500).send('Server error')
  }
})

export default router
