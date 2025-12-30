import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventList from '../components/events/EventList';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import axiosInstance from '../api/axios';

const MyRSVPs = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user1');
    if (storedUser && storedUser !== 'undefined') {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse user:', err);
      }
    }
  }, []);

  useEffect(() => {
    fetchMyRSVPs();
  }, []);

  const fetchMyRSVPs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/rsvp/my-rsvps');
      // Extract events from RSVP objects
      const rsvpEvents = (response.data.data || []).map(rsvp => rsvp.event).filter(Boolean);
      setEvents(rsvpEvents);
    } catch (err) {
      setError(err.message || 'Failed to fetch your RSVPs');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (event) => {
    if (event && event._id) {
      navigate(`/events/${event._id}`);
    }
  };

  const handleEdit = (event) => {
    // Users can't edit events they RSVP'd to, only view
    if (event && event._id) {
      navigate(`/events/${event._id}`);
    }
  };

  const handleDelete = (event) => {
    // Users can't delete events they RSVP'd to
    console.log('Delete not available for RSVPed events');
  };

  if (loading) {
    return <Loader fullScreen={true} text="Loading your RSVPs..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My RSVPs</h1>
        <p className="text-gray-600 mt-2">Events you're attending</p>
      </div>

      {error && (
        <ErrorMessage message={error} onClose={() => setError('')} />
      )}

      <EventList
        initialEvents={events}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        userId={user?._id}
        showFilters={true}
      />
    </div>
  );
};

export default MyRSVPs;
