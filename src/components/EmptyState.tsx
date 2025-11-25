import { FaInbox } from 'react-icons/fa';

const EmptyState = () => {
  return (
    <div className="flex min-h-[400px] items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <FaInbox className="h-10 w-10 text-gray-400" />
          </div>
        </div>
        
        <h3 className="mb-2 text-xl font-bold text-secondary-50">
          No Transactions Yet
        </h3>
        
        <p className="text-sm text-gray-600">
          You don't have any transactions at the moment. Your transaction history will appear here once you start making transactions.
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
