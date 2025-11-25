import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="flex min-h-[400px] items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <FaExclamationTriangle className="h-10 w-10 text-red-600" />
          </div>
        </div>
        
        <h3 className="mb-2 text-xl font-bold text-gray-900">
          Oops! Something went wrong
        </h3>
        
        <p className="mb-6 text-sm text-gray-600">
          {message || 'We encountered an error while loading your transactions. Please try again.'}
        </p>
        
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-50 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          <FaRedo className="h-5 w-5" />
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
