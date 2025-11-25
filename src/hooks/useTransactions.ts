import { useEffect, useState } from 'react';
import { fetchTransactions } from '../api/transactionService';
import type { TransactionData } from '../types/transactions';

interface UseTransactionsReturn {
  data: TransactionData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useTransactions = (): UseTransactionsReturn => {
  const [data, setData] = useState<TransactionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetchTransactions();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const refetch = () => {
    loadTransactions();
  };

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
