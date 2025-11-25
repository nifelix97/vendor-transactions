import type { TransactionResponse } from '../types/transactions';

const API_BASE_URL = 'https://f776e1f2-7f74-4d4d-9ce7-5dfbfbf8b2b2.mock.pstmn.io/test-api';

export class TransactionAPIError extends Error {
  statusCode: number | undefined;
  response: unknown | undefined;

  constructor(
    message: string,
    statusCode: number | undefined = undefined,
    response: unknown | undefined = undefined
  ) {
    super(message);
    this.name = 'TransactionAPIError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

export const fetchTransactions = async (): Promise<TransactionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new TransactionAPIError(
        `Failed to fetch transactions: ${response.statusText}`,
        response.status
      );
    }

    const data: TransactionResponse = await response.json();

    if (data.status !== 'success') {
      throw new TransactionAPIError(
        'API returned error status',
        undefined,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof TransactionAPIError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new TransactionAPIError(
        `Network error: ${error.message}`,
        undefined,
        error
      );
    }

    throw new TransactionAPIError('Unknown error occurred');
  }
};

export const getTransactionById = async (id: string) => {
  try {
    const response = await fetchTransactions();
    const transaction = response.data.transactions.find(txn => txn.id === id);

    if (!transaction) {
      throw new TransactionAPIError(`Transaction with id ${id} not found`, 404);
    }

    return transaction;
  } catch (error) {
    if (error instanceof TransactionAPIError) {
      throw error;
    }
    throw new TransactionAPIError('Failed to get transaction by ID');
  }
};

export const getTransactionsByStatus = async (status: 'success' | 'pending' | 'failed') => {
  try {
    const response = await fetchTransactions();
    return response.data.transactions.filter(txn => txn.status === status);
  } catch (error) {
    if (error instanceof TransactionAPIError) {
      throw error;
    }
    throw new TransactionAPIError('Failed to filter transactions by status');
  }
};

export const getTransactionsByType = async (type: 'cash_out' | 'utility' | 'cash_in' | 'payment') => {
  try {
    const response = await fetchTransactions();
    return response.data.transactions.filter(txn => txn.type === type);
  } catch (error) {
    if (error instanceof TransactionAPIError) {
      throw error;
    }
    throw new TransactionAPIError('Failed to filter transactions by type');
  }
};
