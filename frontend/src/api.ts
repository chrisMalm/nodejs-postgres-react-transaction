// frontend/src/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export interface Transaction {
  amount: number;
}

export interface Login {
 // Define the shape of the response data if needed
 token: string;
 user: { id: number; name: string };
}

type Password = string
type UserName = string


export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await axios.get<Transaction[]>(`${API_BASE_URL}/transactions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const getUser = async (userName: UserName, password: Password): Promise<Login> => {
  try {
    const response = await axios.post<Login>(`${API_BASE_URL}/login`, {
      userName, password
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};
