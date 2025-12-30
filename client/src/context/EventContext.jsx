import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const EventContext = createContext(null);

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    date: '',
    page: 1,
    limit: 12
  });
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
  const fetchEvents = useCallback(async (customFilters = null) => {
    setLoading(true);
    setError(null);
    
    const activeFilters = customFilters || filters;
    
    try {
      const queryParams = new URLSearchParams();
      if (activeFilters.search) queryParams.append('search', activeFilters.search);
      if (activeFilters.category) queryParams.append('category', activeFilters.category);
      if (activeFilters.date) queryParams.append('date', activeFilters.date);
      if (activeFilters.page) queryParams.append('page', activeFilters.page);
      if (activeFilters.limit) queryParams.append('limit', activeFilters.limit);

      const response = await axios.get(
        `${API_URL}/events?${queryParams.toString()}`,
        getConfig()
      );
      
      setEvents(response.data.events || response.data);
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
  }, [filters, getConfig]);

  // Fetch single event
  const fetchEventById = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/events/${eventId}`, getConfig());
      const eventData = response.data.event || response.data;
      setSelectedEvent(eventData);
      return { success: true, data: eventData };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch event';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [getConfig]);

  // Create event
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
      
      if (selectedEvent?._id === eventId) {
        setSelectedEvent(updatedEvent);
      }
      
      return { success: true, data: updatedEvent };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update event';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [getConfig, selectedEvent]);

  // Delete event
  const deleteEvent = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/events/${eventId}`, getConfig());
      setEvents(prev => prev.filter(event => event._id !== eventId));
      
      if (selectedEvent?._id === eventId) {
        setSelectedEvent(null);
      }
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete event';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [getConfig, selectedEvent]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      category: '',
      date: '',
      page: 1,
      limit: 12
    });
  }, []);

  // Clear selected event
  const clearSelectedEvent = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Refresh events
  const refreshEvents = useCallback(() => {
    return fetchEvents();
  }, [fetchEvents]);

  const value = {
    events,
    selectedEvent,
    loading,
    error,
    filters,
    pagination,
    fetchEvents,
    fetchEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    updateFilters,
    resetFilters,
    clearSelectedEvent,
    clearError,
    refreshEvents
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};