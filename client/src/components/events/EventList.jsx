import { useState, useEffect } from 'react';
import EventCard from './EventCard';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import { Search, Filter, Calendar, Grid, List } from 'lucide-react';
import axiosInstance from '../../api/axios';

const EventList = ({ 
  onViewDetails, 
  onEdit, 
  onDelete, 
  userId,
  initialEvents = null,
  showFilters = true 
}) => {
  const [events, setEvents] = useState(initialEvents || []);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(!initialEvents);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Fetch events if not provided
  useEffect(() => {
    if (!initialEvents) {
      fetchEvents();
    }
  }, [initialEvents]);

  // Filter events when search term or filter changes
  useEffect(() => {
    filterEvents();
  }, [searchTerm, filterDate, events]);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await axiosInstance.get('/events');
      setEvents(response.data.data || response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filter
    const now = new Date();
    if (filterDate === 'upcoming') {
      filtered = filtered.filter(event => new Date(event.date) >= now);
    } else if (filterDate === 'past') {
      filtered = filtered.filter(event => new Date(event.date) < now);
    } else if (filterDate === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today && eventDate < tomorrow;
      });
    } else if (filterDate === 'week') {
      const weekFromNow = new Date(now);
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= weekFromNow;
      });
    } else if (filterDate === 'month') {
      const monthFromNow = new Date(now);
      monthFromNow.setMonth(monthFromNow.getMonth() + 1);
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= monthFromNow;
      });
    }

    // Sort by date (upcoming first)
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

    setFilteredEvents(filtered);
  };

  if (isLoading) {
    return <Loader size="large" fullScreen={false} text="Loading events..." />;
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events by title, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Date Filter */}
            <div className="flex gap-2 items-center">
              <Filter className="h-5 w-5 text-gray-500 flex-shrink-0" />
              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="block w-full lg:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="past">Past Events</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Grid View"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="List View"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <ErrorMessage message={error} onClose={() => setError('')} />
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
        </p>
      </div>

      {/* Events Grid/List */}
      {filteredEvents.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'flex flex-col gap-4'
          }
        >
          {filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onViewDetails={onViewDetails}
              onEdit={onEdit}
              onDelete={onDelete}
              isOwner={userId && event.creator && event.creator._id === userId}
              showActions={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">
            {searchTerm || filterDate !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'No events available at the moment'}
          </p>
        </div>
      )}
    </div>
  );
};

export default EventList;