import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const useRSVP = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rsvpStatus, setRsvpStatus] = useState({});

  // Get axios config with auth token
  const getConfig = useCallback(() => {
    const token = localStorage.getItem('token');
    return {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    };
  }, []);

  // Check RSVP status for an event
  const checkRSVPStatus = useCallback(async (eventId) => {
    try {
      const response = await axios.get(
        `${API_URL}/rsvp/${eventId}/status`,
        getConfig()
      );
      const isRSVPed = response.data.isRSVPed || response.data.rsvped;
      setRsvpStatus(prev => ({ ...prev, [eventId]: isRSVPed }));
      return { success: true, isRSVPed };
    } catch (err) {
      return { success: false, isRSVPed: false };
    }
  }, [getConfig]);

  // RSVP to an event
  const rsvpToEvent = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_URL}/rsvp/${eventId}`,
        {},
        getConfig()
      );
      setRsvpStatus(prev => ({ ...prev, [eventId]: true }));
      return { 
        success: true, 
        message: response.data.message || 'RSVP successful',
        data: response.data 
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to RSVP';
      setError(errorMessage);
      
      // Handle specific error cases
      if (err.response?.status === 409) {
        // Already RSVPed or event full
        return { success: false, error: errorMessage, code: 'CONFLICT' };
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [getConfig]);

  // Cancel RSVP
  const cancelRSVP = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(
        `${API_URL}/rsvp/${eventId}`,
        getConfig()
      );
      setRsvpStatus(prev => ({ ...prev, [eventId]: false }));
      return { 
        success: true, 
        message: response.data.message || 'RSVP cancelled',
        data: response.data 
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to cancel RSVP';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [getConfig]);

  // Get attendees list for an event
  const fetchAttendees = useCallback(async (eventId, search = '') => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = search ? `?search=${encodeURIComponent(search)}` : '';
      const response = await axios.get(
        `${API_URL}/rsvp/${eventId}/attendees${queryParams}`,
        getConfig()
      );
      return { 
        success: true, 
        data: response.data.attendees || response.data 
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch attendees';
      setError(errorMessage);
      return { success: false, error: errorMessage, data: [] };
    } finally {
      setLoading(false);
    }
  }, [getConfig]);

  // Get user's RSVPed events
  const fetchMyRSVPs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/rsvp/my-rsvps`, getConfig());
      return { 
        success: true, 
        data: response.data.events || response.data 
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch your RSVPs';
      setError(errorMessage);
      return { success: false, error: errorMessage, data: [] };
    } finally {
      setLoading(false);
    }
  }, [getConfig]);

  // Get event capacity info
  const fetchCapacityInfo = useCallback(async (eventId) => {
    try {
      const response = await axios.get(
        `${API_URL}/events/${eventId}/capacity`,
        getConfig()
      );
      return { 
        success: true, 
        data: {
          currentAttendees: response.data.currentAttendees,
          capacity: response.data.capacity,
          availableSpots: response.data.availableSpots,
          isFull: response.data.isFull
        }
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch capacity info';
      return { success: false, error: errorMessage };
    }
  }, [getConfig]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    rsvpStatus,
    checkRSVPStatus,
    rsvpToEvent,
    cancelRSVP,
    fetchAttendees,
    fetchMyRSVPs,
    fetchCapacityInfo,
    clearError
  };
};