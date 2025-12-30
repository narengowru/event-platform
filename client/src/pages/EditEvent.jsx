import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventForm from '../components/events/EventForm';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import axiosInstance from '../api/axios';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get(`/events/${id}`);
      setEvent(response.data.data);
    } catch (err) {
      setError(err.message || 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (eventData) => {
    // Navigate to event details after successful update
    navigate(`/events/${eventData._id}`);
  };

  const handleCancel = () => {
    navigate(`/events/${id}`);
  };

  if (loading) {
    return <Loader fullScreen={true} text="Loading event..." />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error} onClose={() => navigate('/my-events')} />
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <EventForm
        eventId={id}
        initialData={event}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EditEvent;
