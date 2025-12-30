import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventList from '../components/events/EventList';
import DeleteConfirmModal from '../components/events/DeleteConfirmModal';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import axiosInstance from '../api/axios';

const MyEvents = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

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
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/events/user/my-events');
      setEvents(response.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch your events');
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
    if (event && event._id) {
      navigate(`/events/edit/${event._id}`);
    }
  };

  const handleDeleteClick = (event) => {
    if (event && event._id) {
      setEventToDelete(event);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;

    try {
      await axiosInstance.delete(`/events/${eventToDelete._id}`);
      setEvents(prev => prev.filter(e => e._id !== eventToDelete._id));
      setShowDeleteModal(false);
      setEventToDelete(null);
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return <Loader fullScreen={true} text="Loading your events..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
        <p className="text-gray-600 mt-2">Manage the events you've created</p>
      </div>

      {error && (
        <ErrorMessage message={error} onClose={() => setError('')} />
      )}

      <EventList
        initialEvents={events}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        userId={user?._id}
        showFilters={true}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setEventToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Event"
        itemName={eventToDelete?.title}
        itemType="event"
      />
    </div>
  );
};

export default MyEvents;
