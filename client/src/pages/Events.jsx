import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventList from '../components/events/EventList';
import DeleteConfirmModal from '../components/events/DeleteConfirmModal';
import axiosInstance from '../api/axios';

const Events = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

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
      setShowDeleteModal(false);
      setEventToDelete(null);
      // Reload the page to refresh the event list
      window.location.reload();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Events</h1>
        <p className="text-gray-600 mt-2">Discover amazing events happening around you</p>
      </div>

      <EventList
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

export default Events;

