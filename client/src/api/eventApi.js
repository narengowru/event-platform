// src/api/eventApi.js
import axiosInstance from './axios';

// Get all events
export const getAllEvents = async () => {
  const response = await axiosInstance.get('/events');
  return response.data;
};

// Get single event by ID
export const getEventById = async (eventId) => {
  const response = await axiosInstance.get(`/events/${eventId}`);
  return response.data;
};

// Create new event
export const createEvent = async (eventData) => {
  const response = await axiosInstance.post('/events', eventData);
  return response.data;
};

// Update event
export const updateEvent = async (eventId, eventData) => {
  const response = await axiosInstance.put(`/events/${eventId}`, eventData);
  return response.data;
};

// Delete event
export const deleteEvent = async (eventId) => {
  const response = await axiosInstance.delete(`/events/${eventId}`);
  return response.data;
};

// Get events created by current user
export const getMyEvents = async () => {
  const response = await axiosInstance.get('/events/user/my-events');
  return response.data;
};