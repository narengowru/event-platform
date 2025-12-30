import { useNavigate } from 'react-router-dom';
import EventForm from '../components/events/EventForm';

const CreateEvent = () => {
  const navigate = useNavigate();

  const handleSuccess = (eventData) => {
    // Navigate to event details after successful creation
    navigate(`/events/${eventData._id}`);
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <EventForm
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default CreateEvent;
