import { useState, useEffect } from 'react';
import { Users, Mail, Calendar, Search, X } from 'lucide-react';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const AttendeesList = ({ eventId, fetchAttendees, showSearch = false }) => {
  const [attendees, setAttendees] = useState([]);
  const [filteredAttendees, setFilteredAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAttendees();
  }, [eventId]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = attendees.filter(attendee =>
        attendee.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendee.user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAttendees(filtered);
    } else {
      setFilteredAttendees(attendees);
    }
  }, [searchQuery, attendees]);

  const loadAttendees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAttendees(eventId);
      setAttendees(data);
      setFilteredAttendees(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load attendees');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="py-8">
        <Loader size="medium" text="Loading attendees..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onClose={() => setError(null)} 
      />
    );
  }

  if (attendees.length === 0) {
    return (
      <div className="text-center py-12">
        <Users size={48} className="mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500 text-lg">No attendees yet</p>
        <p className="text-gray-400 text-sm mt-1">Be the first to RSVP!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={24} className="text-blue-500" />
          <h3 className="text-xl font-semibold text-gray-800">
            Attendees ({filteredAttendees.length})
          </h3>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && attendees.length > 5 && (
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search attendees by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>
      )}

      {/* Attendees list */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredAttendees.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No attendees match your search</p>
          </div>
        ) : (
          filteredAttendees.map((attendee) => (
            <div
              key={attendee._id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                    {attendee.user.name.charAt(0).toUpperCase()}
                  </div>

                  {/* User info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 truncate">
                      {attendee.user.name}
                    </h4>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <Mail size={14} />
                      <span className="truncate">{attendee.user.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Calendar size={12} />
                      <span>RSVP'd on {formatDate(attendee.rsvpDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Status badge */}
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex-shrink-0">
                  {attendee.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AttendeesList;