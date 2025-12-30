import { Users, AlertCircle, CheckCircle } from 'lucide-react';

const CapacityIndicator = ({ 
  currentAttendees, 
  capacity, 
  showDetails = true,
  size = 'medium',
  variant = 'default' // 'default', 'compact', 'minimal'
}) => {
  // Calculate percentage
  const percentage = (currentAttendees / capacity) * 100;
  const spotsLeft = capacity - currentAttendees;
  const isFull = currentAttendees >= capacity;

  // Determine color based on capacity
  const getColorClasses = () => {
    if (isFull) {
      return {
        bg: 'bg-red-500',
        text: 'text-red-700',
        border: 'border-red-200',
        lightBg: 'bg-red-50'
      };
    } else if (percentage >= 80) {
      return {
        bg: 'bg-orange-500',
        text: 'text-orange-700',
        border: 'border-orange-200',
        lightBg: 'bg-orange-50'
      };
    } else if (percentage >= 50) {
      return {
        bg: 'bg-yellow-500',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        lightBg: 'bg-yellow-50'
      };
    } else {
      return {
        bg: 'bg-green-500',
        text: 'text-green-700',
        border: 'border-green-200',
        lightBg: 'bg-green-50'
      };
    }
  };

  const colors = getColorClasses();

  // Size variants for progress bar height
  const progressHeights = {
    small: 'h-1.5',
    medium: 'h-2',
    large: 'h-3'
  };

  // Minimal variant - just a badge
  if (variant === 'minimal') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${colors.lightBg} ${colors.text} text-xs font-medium`}>
        <Users size={14} />
        <span>{currentAttendees}/{capacity}</span>
      </div>
    );
  }

  // Compact variant - progress bar with inline text
  if (variant === 'compact') {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <Users size={14} />
            <span className="font-medium">{currentAttendees}/{capacity}</span>
          </span>
          <span className="font-medium">{percentage.toFixed(0)}%</span>
        </div>
        <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${progressHeights[size]}`}>
          <div
            className={`${colors.bg} ${progressHeights[size]} transition-all duration-500 ease-out`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    );
  }

  // Default variant - full details with status message
  return (
    <div className={`border ${colors.border} rounded-lg p-4 ${colors.lightBg}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users size={20} className={colors.text} />
          <h4 className={`font-semibold ${colors.text}`}>
            Event Capacity
          </h4>
        </div>
        {isFull ? (
          <AlertCircle size={20} className="text-red-500" />
        ) : (
          <CheckCircle size={20} className="text-green-500" />
        )}
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${progressHeights[size]}`}>
          <div
            className={`${colors.bg} ${progressHeights[size]} transition-all duration-500 ease-out rounded-full`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        {/* Stats */}
        {showDetails && (
          <div className="flex items-center justify-between text-sm">
            <span className={`font-medium ${colors.text}`}>
              {currentAttendees} / {capacity} attendees
            </span>
            <span className={`font-semibold ${colors.text}`}>
              {percentage.toFixed(0)}%
            </span>
          </div>
        )}
      </div>

      {/* Status message */}
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          {isFull ? (
            <p className="text-sm font-medium text-red-700 flex items-center gap-2">
              <AlertCircle size={16} />
              Event is at full capacity
            </p>
          ) : spotsLeft <= 5 ? (
            <p className="text-sm font-medium text-orange-700 flex items-center gap-2">
              <AlertCircle size={16} />
              Only {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} remaining!
            </p>
          ) : (
            <p className="text-sm font-medium text-green-700 flex items-center gap-2">
              <CheckCircle size={16} />
              {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} available
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CapacityIndicator;