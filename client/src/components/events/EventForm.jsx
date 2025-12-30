import { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  FileText, 
  Upload, 
  X,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import SuccessMessage from '../common/SuccessMessage';
import axiosInstance from '../../api/axios';

const EventForm = ({ 
  eventId = null, 
  initialData = null,
  onSuccess,
  onCancel 
}) => {
  const isEditMode = !!eventId || !!initialData;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: '',
    imageUrl: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Load initial data for edit mode
  useEffect(() => {
    if (initialData) {
      const eventDate = new Date(initialData.date);
      const formattedDate = eventDate.toISOString().slice(0, 16);

      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        date: formattedDate,
        location: initialData.location || '',
        capacity: initialData.capacity || '',
        imageUrl: initialData.imageUrl || ''
      });

      if (initialData.imageUrl) {
        setImagePreview(initialData.imageUrl);
      }
    }
  }, [initialData]);

  // Validation functions
  const validateTitle = (title) => {
    if (!title.trim()) return 'Title is required';
    if (title.trim().length < 3) return 'Title must be at least 3 characters';
    if (title.trim().length > 100) return 'Title must not exceed 100 characters';
    return '';
  };

  const validateDescription = (description) => {
    if (!description.trim()) return 'Description is required';
    if (description.trim().length < 10) return 'Description must be at least 10 characters';
    if (description.trim().length > 2000) return 'Description must not exceed 2000 characters';
    return '';
  };

  const validateDate = (date) => {
    if (!date) return 'Date and time are required';
    const selectedDate = new Date(date);
    const now = new Date();
    if (selectedDate < now) return 'Event date must be in the future';
    return '';
  };

  const validateLocation = (location) => {
    if (!location.trim()) return 'Location is required';
    if (location.trim().length < 3) return 'Location must be at least 3 characters';
    if (location.trim().length > 200) return 'Location must not exceed 200 characters';
    return '';
  };

  const validateCapacity = (capacity) => {
    if (!capacity) return 'Capacity is required';
    const num = parseInt(capacity);
    if (isNaN(num) || num < 1) return 'Capacity must be at least 1';
    if (num > 10000) return 'Capacity must not exceed 10,000';
    return '';
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (apiError) setApiError('');
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
      return;
    }

    setImageFile(file);
    setErrors(prev => ({ ...prev, image: '' }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  // Upload image to server
  const uploadImage = async () => {
    if (!imageFile) return formData.imageUrl;

    setIsUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('image', imageFile);

      const response = await axiosInstance.post('/upload', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data.data.url;
    } catch (err) {
      throw new Error(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  // AI Generate Description (Bonus Feature)
  const generateDescription = async () => {
    if (!formData.title || !formData.location) {
      setApiError('Please enter title and location first to generate description');
      return;
    }

    setIsGenerating(true);
    setApiError('');

    try {
      // Simulated AI generation - replace with actual API call if available
      const prompt = `Generate a compelling event description for "${formData.title}" taking place at ${formData.location}`;
      
      // Placeholder response - integrate with actual AI API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const generatedDesc = `Join us for an exciting ${formData.title} at ${formData.location}! This event promises to be an unforgettable experience where attendees will have the opportunity to connect, learn, and engage with like-minded individuals. Whether you're a first-timer or a regular, this event offers something special for everyone. Don't miss out on this incredible opportunity to be part of something amazing!`;
      
      setFormData(prev => ({ ...prev, description: generatedDesc }));
    } catch (err) {
      setApiError('Failed to generate description. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {
      title: validateTitle(formData.title),
      description: validateDescription(formData.description),
      date: validateDate(formData.date),
      location: validateLocation(formData.location),
      capacity: validateCapacity(formData.capacity)
    };

    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      // Upload image first if there's a new one
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: new Date(formData.date).toISOString(),
        location: formData.location.trim(),
        capacity: parseInt(formData.capacity),
        imageUrl
      };

      let response;
      if (isEditMode) {
        response = await axiosInstance.put(`/events/${eventId || initialData._id}`, eventData);
      } else {
        response = await axiosInstance.post('/events', eventData);
      }

      setSuccessMessage(`Event ${isEditMode ? 'updated' : 'created'} successfully!`);
      
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }, 1500);

    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditMode ? 'Edit Event' : 'Create New Event'}
          </h2>
          <p className="text-gray-600">
            {isEditMode 
              ? 'Update your event details below' 
              : 'Fill in the details to create your event'}
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />
        )}

        {/* API Error Message */}
        {apiError && (
          <ErrorMessage message={apiError} onClose={() => setApiError('')} />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-3 border ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="e.g., Tech Conference 2024"
                disabled={isLoading}
              />
            </div>
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Description with AI Generator */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <button
                type="button"
                onClick={generateDescription}
                disabled={isGenerating || isLoading}
                className="flex items-center gap-2 px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {isGenerating ? 'Generating...' : 'AI Generate'}
              </button>
            </div>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className={`block w-full px-3 py-3 border ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Describe your event in detail..."
              disabled={isLoading}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.description.length} / 2000 characters
            </p>
          </div>

          {/* Date & Time */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date & Time *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-3 border ${
                  errors.date ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                disabled={isLoading}
              />
            </div>
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-3 border ${
                  errors.location ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="e.g., Convention Center, New York"
                disabled={isLoading}
              />
            </div>
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>

          {/* Capacity */}
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
              Capacity *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                max="10000"
                className={`block w-full pl-10 pr-3 py-3 border ${
                  errors.capacity ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Maximum number of attendees"
                disabled={isLoading}
              />
            </div>
            {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Image
            </label>
            
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                  disabled={isLoading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isLoading}
                />
                <label
                  htmlFor="image"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </label>
              </div>
            )}
            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={isLoading || isUploading}
              className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading || isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader size="small" />
                  {isUploading ? 'Uploading...' : isEditMode ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                isEditMode ? 'Update Event' : 'Create Event'
              )}
            </button>
            
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;