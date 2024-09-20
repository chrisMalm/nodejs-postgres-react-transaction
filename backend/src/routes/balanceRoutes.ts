import { Router } from 'express'
import { pool } from '../db/pool'

const router = Router()

// Get user balance
router.get('/userBalance/:id', async (req, res) => {
  const { id } = req.params

  try {
    const accountQuery = 'SELECT balance FROM bank_balances WHERE user_id = $1'
    const result = await pool.query(accountQuery, [id])

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: 'No user account found for this user' })
    }

    const { balance } = result.rows[0] // Extracting balance
    res.json({ balance }) // Sending only the balance
  } catch (err: any) {
    console.error('Error processing Balance:', err.message)
    res.status(500).send('Server error')
  }
})

export default router
