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

// export interface WireUserTransaction {
//   // Define the shape of the response data if needed
//   amount: string
//   userId?: string
// }

export interface UserTransaction {
  // Define the shape of the response data if needed
  balance: number
  transaction_date: string
}

type Password = string
type UserName = string
type UserId = string | undefined

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

export const wireTransaction = async (
  amount: string,
  userId: UserId
): Promise<UserTransaction> => {
  try {
    const response = await axios.put<UserTransaction>(
      `${API_BASE_URL}/userTransaction`,
      {
        amount,
        userId,
      }
    )

    return response.data
  } catch (error) {
    console.error('Error wiring transaction:', error)
    throw error
  }
}
