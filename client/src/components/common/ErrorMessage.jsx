// src/components/common/ErrorMessage.jsx
import { FiAlertCircle, FiX } from 'react-icons/fi';

const ErrorMessage = ({ message, onClose, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <FiAlertCircle className="text-red-500 text-xl mt-0.5 flex-shrink-0" />
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-800 font-medium">
            {message}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 flex-shrink-0 text-red-500 hover:text-red-700 transition"
            aria-label="Close error message"
          >
            <FiX className="text-xl" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;