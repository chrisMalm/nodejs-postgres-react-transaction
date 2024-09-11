// frontend/src/App.tsx
import React, { useState, useEffect } from 'react';
import { getTransactions, Transaction } from './api';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch (error) {
        setError('Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Transactions</h1>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>{transaction.amount}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
