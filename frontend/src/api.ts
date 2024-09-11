// frontend/src/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export interface Transaction {
  amount: number;
}

export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await axios.get<Transaction[]>(`${API_BASE_URL}/transactions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};