import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import authRoutes from './routes/authRoutes'
import transactionRoutes from './routes/transactionRoutes'
import balanceRoutes from './routes/balanceRoutes'

const app = express()
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())

// Routes
app.use(authRoutes)
app.use(transactionRoutes)
app.use(balanceRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
