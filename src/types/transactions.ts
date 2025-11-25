export type TransactionType = 'cash_out' | 'utility' | 'cash_in' | 'payment';


export type TransactionStatus = 'success' | 'pending' | 'failed';


export type Currency = 'RWF' | string;

export interface Transaction {
  id: string;
  date: string;
  recipient: string;
  amount: number;
  currency: Currency;
  type: TransactionType;
  status: TransactionStatus;
}


export interface TransactionData {
  total_balance: number;
  currency: Currency;
  transactions: Transaction[];
}

export interface TransactionResponse {
  status: 'success' | 'error';
  data: TransactionData;
}
