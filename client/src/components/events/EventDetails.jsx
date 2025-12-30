import { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  User,
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import SuccessMessage from '../common/SuccessMessage';
import axiosInstance from '../../api/axios';

const EventDetails = ({
  eventId,
  onBack,
  onEdit,
  onDelete,
  onRSVP,
  userId
}) => {
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasRSVPd, setHasRSVPd] = useState(false);
  const [isRSVPLoading, setIsRSVPLoading] = useState(false);

  useEffect(() => {
    if (!eventId) return;   // ⛔ STOP execution if eventId missing

    fetchEventDetails();
    fetchAttendees();
  }, [eventId]);


  useEffect(() => {
    if (attendees.length > 0 && userId) {
      checkRSVPStatus();
    }
  }, [attendees, userId]);

  const fetchEventDetails = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await axiosInstance.get(`/events/${eventId}`);
      setEvent(response.data.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch event details');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAttendees = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axiosInstance.get(`/rsvp/event/${eventId}`);
      setAttendees(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch attendees:', err);
    }
  };

  const checkRSVPStatus = () => {
    if (!userId) return;
    const userHasRSVPd = attendees.some(
      (attendee) => attendee.user && attendee.user._id === userId
    );
    setHasRSVPd(userHasRSVPd);
  };

  const handleRSVP = async () => {
    if (!userId) {
      setError('Please log in to RSVP');
      return;
    }

    setIsRSVPLoading(true);
    setError('');
    setSuccess('');

    try {
      let response;
      if (hasRSVPd) {
        response = await axiosInstance.delete(`/rsvp/${eventId}`);
      } else {
        response = await axiosInstance.post(`/rsvp/${eventId}`);
      }

      setSuccess(hasRSVPd ? 'RSVP cancelled successfully' : 'RSVP confirmed successfully');
      setHasRSVPd(!hasRSVPd);

      // Refresh event details and attendees
      if (eventId) {
        await fetchEventDetails();
        await fetchAttendees();
      }

      if (onRSVP) {
        onRSVP();
      }
    } catch (err) {
      setError(err.message || 'Failed to process RSVP');
    } finally {
      setIsRSVPLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const isOwner = userId && event && event.creator && event.creator._id === userId;
  const isFull = event && event.currentAttendees >= event.capacity;
  const isPastEvent = event && new Date(event.date) < new Date();
  const capacityPercentage = event ? (event.currentAttendees / event.capacity) * 100 : 0;

  if (isLoading) {
    return <Loader size="large" fullScreen={false} text="Loading event details..." />;
  }

  if (error && !event) {
    return (
      <div>
        <ErrorMessage message={error} onClose={() => setError('')} />
        <button
          onClick={onBack}
          className="mt-4 flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Events
      </button>

      {/* Success/Error Messages */}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}
      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      {/* Event Image */}
      <div className="relative h-96 rounded-lg overflow-hidden bg-gray-200">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
            <Calendar className="w-24 h-24 text-white opacity-50" />
          </div>
        )}

        {/* Status Badges */}
        <div className="absolute top-4 right-4 flex gap-2">
          {isPastEvent && (
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-800 text-white">
              Past Event
            </span>
          )}
          {isFull && !isPastEvent && (
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-red-600 text-white">
              Event Full
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>

            {/* Creator Info */}
            {event.creator && (
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <span className="text-sm">
                  Created by <span className="font-medium">{event.creator.name}</span>
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {isOwner ? (
              <>
                <button
                  onClick={() => onEdit && onEdit(event)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Event
                </button>
                <button
                  onClick={() => onDelete && onDelete(event)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            ) : (
              <button
                onClick={handleRSVP}
                disabled={isRSVPLoading || (isFull && !hasRSVPd) || isPastEvent}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${hasRSVPd
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : isFull
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isRSVPLoading ? (
                  <Loader size="small" />
                ) : hasRSVPd ? (
                  <>
                    <XCircle className="w-5 h-5" />
                    Cancel RSVP
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    {isFull ? 'Event Full' : 'RSVP Now'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-start gap-3">
            <Calendar className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm text-gray-500 mb-1">Date</p>
              <p className="text-gray-900 font-medium">{formatDate(event.date)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm text-gray-500 mb-1">Time</p>
              <p className="text-gray-900 font-medium">{formatTime(event.date)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm text-gray-500 mb-1">Location</p>
              <p className="text-gray-900 font-medium">{event.location}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm text-gray-500 mb-1">Capacity</p>
              <p className="text-gray-900 font-medium">
                {event.currentAttendees} / {event.capacity} attendees
              </p>
            </div>
          </div>
        </div>

        {/* Capacity Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Event Capacity</span>
            <span className="text-sm text-gray-600">{Math.round(capacityPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${capacityPercentage >= 100
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

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Event</h2>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Attendees Section */}
        {attendees.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Attendees ({attendees.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {attendees.slice(0, 12).map((attendee) => (
                <div
                  key={attendee._id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium">
                      {attendee.user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {attendee.user?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(attendee.rsvpDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {attendees.length > 12 && (
              <p className="text-sm text-gray-600 mt-3">
                +{attendees.length - 12} more attendees
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;