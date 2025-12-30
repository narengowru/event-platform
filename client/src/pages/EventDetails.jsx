import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useEvents } from '../hooks/useEvents';
import EventDetailsComponent from '../components/events/EventDetails';
import DeleteConfirmModal from '../components/events/DeleteConfirmModal';
import axiosInstance from '../api/axios';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { deleteEvent } = useEvents(false);
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

  const handleBack = () => {
    navigate('/events');
  };

  const handleEdit = (event) => {
    navigate(`/events/edit/${event._id}`);
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;

    try {
      await axiosInstance.delete(`/events/${eventToDelete._id}`);
      setShowDeleteModal(false);
      navigate('/my-events');
    } catch (error) {
      throw error;
    }
  };

  const handleRSVP = () => {
    // Refresh the page to show updated RSVP status
    window.location.reload();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <EventDetailsComponent
        eventId={id}
        onBack={handleBack}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onRSVP={handleRSVP}
        userId={user?._id}
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

export default EventDetails;
