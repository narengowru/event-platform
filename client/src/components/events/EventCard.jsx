import { Calendar, MapPin, Users, Clock, Edit, Trash2, Eye } from 'lucide-react';

const EventCard = ({ 
  event, 
  onViewDetails, 
  onEdit, 
  onDelete, 
  isOwner = false,
  showActions = true 
}) => {
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate capacity percentage
  const capacityPercentage = (event.currentAttendees / event.capacity) * 100;
  
  // Determine capacity status
  const getCapacityStatus = () => {
    if (capacityPercentage >= 100) return { text: 'Full', color: 'text-red-600 bg-red-50' };
    if (capacityPercentage >= 80) return { text: 'Almost Full', color: 'text-orange-600 bg-orange-50' };
    if (capacityPercentage >= 50) return { text: 'Filling Up', color: 'text-yellow-600 bg-yellow-50' };
    return { text: 'Available', color: 'text-green-600 bg-green-50' };
  };

  const capacityStatus = getCapacityStatus();

  // Check if event is past
  const isPastEvent = new Date(event.date) < new Date();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
            <Calendar className="w-16 h-16 text-white opacity-50" />
          </div>
        )}
        
        {/* Capacity Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${capacityStatus.color}`}>
            {capacityStatus.text}
          </span>
        </div>

        {/* Past Event Badge */}
        {isPastEvent && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-800 text-white">
              Past Event
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          {/* Date and Time */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Calendar className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span>{formatDate(event.date)}</span>
            <Clock className="w-4 h-4 text-indigo-600 flex-shrink-0 ml-2" />
            <span>{formatTime(event.date)}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>

          {/* Capacity */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Users className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span>
              {event.currentAttendees} / {event.capacity} attendees
            </span>
          </div>
        </div>

        {/* Capacity Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                capacityPercentage >= 100
                  ? 'bg-red-500'
                  : capacityPercentage >= 80
                  ? 'bg-orange-500'
                  : capacityPercentage >= 50
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Creator Info */}
        {event.creator && (
          <div className="mb-4 pb-4 border-b border-gray-200">
            <p className="text-xs text-gray-500">
              Created by{' '}
              <span className="font-medium text-gray-700">{event.creator.name}</span>
            </p>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2">
            {/* View Details Button */}
            <button
              onClick={() => onViewDetails && onViewDetails(event)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>

            {/* Owner Actions */}
            {isOwner && (
              <>
                <button
                  onClick={() => onEdit && onEdit(event)}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  title="Edit Event"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete && onDelete(event)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;