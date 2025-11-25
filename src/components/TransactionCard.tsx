import type { Transaction } from '../types/transactions';

interface TransactionCardProps {
  transaction: Transaction;
  onClick?: (transaction: Transaction) => void;
}

const TransactionCard = ({ transaction, onClick }: TransactionCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cash_in':
        return '↓';
      case 'cash_out':
        return '↑';
      case 'utility':
        return '⚡';
      case 'payment':
        return '💳';
      default:
        return '•';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cash_in':
        return 'text-green-600';
      case 'cash_out':
        return 'text-red-600';
      case 'utility':
        return 'text-primary-50';
      case 'payment':
        return 'text-secondary-50';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  return (
    <div
      onClick={() => onClick?.(transaction)}
      className={`
        group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 
        shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary-50/5 to-secondary-50/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex flex-1 items-start gap-4">
          <div className={`
            flex h-12 w-12 shrink-0 items-center justify-center rounded-xl 
            bg-linear-to-br from-gray-50 to-gray-100 text-2xl font-semibold
            shadow-sm transition-transform duration-300 group-hover:scale-110
            ${getTypeColor(transaction.type)}
          `}>
            {getTypeIcon(transaction.type)}
          </div>

          {/* Transaction details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate mb-1">
              {transaction.recipient}
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              {formatDate(transaction.date)}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Status badge */}
              <span className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                border ${getStatusColor(transaction.status)}
              `}>
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                {transaction.type.replace('_', ' ').charAt(0).toUpperCase() + transaction.type.replace('_', ' ').slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Right section: Amount */}
        <div className="flex flex-col items-end shrink-0">
          <p className={`
            text-lg font-bold mb-1
            ${transaction.type === 'cash_in' ? 'text-green-600' : 'text-gray-900'}
          `}>
            {transaction.type === 'cash_in' ? '+' : '-'}{formatAmount(transaction.amount, transaction.currency)}
          </p>
          <p className="text-xs text-gray-400 font-mono">
            {transaction.id}
          </p>
        </div>
      </div>

      {onClick && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default TransactionCard;
