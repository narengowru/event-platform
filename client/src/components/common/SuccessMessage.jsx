// src/components/common/SuccessMessage.jsx
import { FiCheckCircle, FiX } from 'react-icons/fi';

const SuccessMessage = ({ message, onClose, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <FiCheckCircle className="text-green-500 text-xl mt-0.5 flex-shrink-0" />
        <div className="ml-3 flex-1">
          <p className="text-sm text-green-800 font-medium">
            {message}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 flex-shrink-0 text-green-500 hover:text-green-700 transition"
            aria-label="Close success message"
          >
            <FiX className="text-xl" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessMessage;