// src/components/common/Loader.jsx
import { FiLoader } from 'react-icons/fi';

const Loader = ({ size = 'medium', fullScreen = false, text = 'Loading...' }) => {
  // Size classes for the spinner
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  // Text size classes
  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <FiLoader 
        className={`${sizeClasses[size]} text-indigo-600 animate-spin`}
      />
      {text && (
        <p className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
          {text}
        </p>
      )}
    </div>
  );

  // Full screen loader
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  // Inline loader
  return (
    <div className="flex items-center justify-center p-8">
      {spinner}
    </div>
  );
};

export default Loader;