// frontend/src/api.ts
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000'

export interface Transaction {
  amount: number
}

export interface Login {
  // Define the shape of the response data if needed
  token: string
  user: { id: number; name: string }
}

export interface UserTransactions {
  // Define the shape of the response data if needed
  amount: number
  transaction_date: string
}

type Password = string
type UserName = string
type UserId = string | undefined

export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await axios.get<Transaction[]>(
      `${API_BASE_URL}/transactions`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching transactions:', error)
    throw error
  }
}

export const getUser = async (
  userName: UserName,
  password: Password
): Promise<Login> => {
  try {
    const response = await axios.post<Login>(`${API_BASE_URL}/login`, {
      userName,
      password,
    })
    return response.data
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}

export const getUserTransactions = async (
  userId: UserId
): Promise<UserTransactions[]> => {
  try {
    const response = await axios.get<UserTransactions[]>(
      `${API_BASE_URL}/userTransacations/${userId}`
    )

    return response.data
  } catch (error) {
    console.error('Error fetching user transactions:', error)
    throw error
  }
}
