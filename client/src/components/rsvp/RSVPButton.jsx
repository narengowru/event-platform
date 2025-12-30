import { useState } from 'react';
import { Calendar, CalendarCheck, CalendarX, Loader2 } from 'lucide-react';

const RSVPButton = ({ 
  eventId, 
  isRSVPed, 
  isFull, 
  onRSVP, 
  onCancel, 
  disabled = false,
  size = 'medium' 
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || loading) return;

    setLoading(true);
    try {
      if (isRSVPed) {
        await onCancel(eventId);
      } else {
        await onRSVP(eventId);
      }
    } catch (error) {
      console.error('RSVP action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Size variants
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24
  };

  // Determine button state and styling
  const getButtonConfig = () => {
    if (loading) {
      return {
        text: isRSVPed ? 'Cancelling...' : 'Joining...',
        icon: <Loader2 size={iconSizes[size]} className="animate-spin" />,
        className: 'bg-gray-400 cursor-not-allowed',
        disabled: true
      };
    }

    if (isRSVPed) {
      return {
        text: 'Cancel RSVP',
        icon: <CalendarX size={iconSizes[size]} />,
        className: 'bg-red-500 hover:bg-red-600 active:bg-red-700',
        disabled: false
      };
    }

    if (isFull) {
      return {
        text: 'Event Full',
        icon: <CalendarCheck size={iconSizes[size]} />,
        className: 'bg-gray-400 cursor-not-allowed',
        disabled: true
      };
    }

    return {
      text: 'RSVP Now',
      icon: <Calendar size={iconSizes[size]} />,
      className: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700',
      disabled: false
    };
  };

  const config = getButtonConfig();

  return (
    <button
      onClick={handleClick}
      disabled={disabled || config.disabled}
      className={`
        ${sizeClasses[size]}
        ${config.className}
        text-white font-semibold rounded-lg
        flex items-center justify-center gap-2
        transition-all duration-200
        shadow-md hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        ${isRSVPed ? 'focus:ring-red-500' : 'focus:ring-blue-500'}
        w-full
      `}
    >
      {config.icon}
      <span>{config.text}</span>
    </button>
  );
};

export default RSVPButton;