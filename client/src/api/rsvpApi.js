// src/api/rsvpApi.js
import axiosInstance from './axios';

// RSVP to an event
export const rsvpToEvent = async (eventId) => {
  const response = await axiosInstance.post(`/rsvp/${eventId}`);
  return response.data;
};

// Cancel RSVP
export const cancelRSVP = async (eventId) => {
  const response = await axiosInstance.delete(`/rsvp/${eventId}`);
  return response.data;
};

// Get attendees for an event
export const getEventAttendees = async (eventId) => {
  const response = await axiosInstance.get(`/rsvp/event/${eventId}`);
  return response.data;
};

// Get current user's RSVPs
export const getMyRSVPs = async () => {
  const response = await axiosInstance.get('/rsvp/my-rsvps');
  return response.data;
};