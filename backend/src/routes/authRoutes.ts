import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from '../db/pool'
import dotenv from 'dotenv'
import { generateToken } from '../utils/jwt'
dotenv.config()

const router = Router()

// Login route
router.post('/login', async (req, res) => {
  const { userName, password } = req.body

  try {
    const query = 'SELECT id, name, password FROM users WHERE name = $1'
    const result = await pool.query(query, [userName])

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }
    const user = result.rows[0]
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }
    const jwtSecret = process.env.JWT_SECRET

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the environment variables.')
    }
    const token = generateToken({ id: user.id, name: user.name })

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name },
    })
  } catch (err: any) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

export default router
