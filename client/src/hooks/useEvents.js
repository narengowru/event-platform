import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const useEvents = (autoFetch = true) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEvents: 0
  });

  // Get axios config with auth token
  const getConfig = useCallback(() => {
    const token = localStorage.getItem('token');
    return {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    };
  }, []);

  // Fetch all events
  const fetchEvents = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.date) queryParams.append('date', filters.date);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);

      const response = await axios.get(
        `${API_URL}/events?${queryParams.toString()}`,
        getConfig()
      );
      
      // Backend returns { success: true, data: events } or { success: true, data: [events] }
      const eventsData = response.data.data || response.data.events || response.data;
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch events';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [getConfig]);

  // Fetch single event by ID
  const fetchEventById = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/events/${eventId}`, getConfig());
      return { success: true, data: response.data.event || response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch event';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [getConfig]);

  // Create new event
  const createEvent = useCallback(async (eventData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/events`, eventData, getConfig());
      const newEvent = response.data.event || response.data;
      setEvents(prev => [newEvent, ...prev]);
      return { success: true, data: newEvent };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create event';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [getConfig]);

  // Update event
  const updateEvent = useCallback(async (eventId, eventData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `${API_URL}/events/${eventId}`,
        eventData,
        getConfig()
      );
      const updatedEvent = response.data.event || response.data;
      setEvents(prev => 
        prev.map(event => event._id === eventId ? updatedEvent : event)
      );
      return { success: true, data: updatedEvent };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update event';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [getConfig]);

  // Delete event
  const deleteEvent = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/events/${eventId}`, getConfig());
      setEvents(prev => prev.filter(event => event._id !== eventId));
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete event';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [getConfig]);

  // Fetch user's created events
  const fetchMyEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/events/user/my-events`, getConfig());
      // Backend returns { success: true, data: events }
      return { success: true, data: response.data.data || response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch your events';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [getConfig]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchEvents();
    }
  }, [autoFetch, fetchEvents]);

  return {
    events,
    loading,
    error,
    pagination,
    fetchEvents,
    fetchEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    fetchMyEvents,
    clearError
  };
};