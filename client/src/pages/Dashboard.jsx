import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiPlus, FiList, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { useEvents } from '../hooks/useEvents';
import Loader from '../components/common/Loader';
import axiosInstance from '../api/axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const { fetchMyEvents } = useEvents(false);
  const [stats, setStats] = useState({
    myEvents: 0,
    myRSVPs: 0,
    totalAttendees: 0
  });
  const [loading, setLoading] = useState(true);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user1');
    if (storedUser && storedUser !== 'undefined') {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse user:', err);
      }
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch user's events
      const myEventsResult = await fetchMyEvents();
      const myEvents = myEventsResult.data || [];

      // Fetch user's RSVPs
      const rsvpResponse = await axiosInstance.get('/rsvp/my-rsvps');
      const myRSVPs = rsvpResponse.data.data || [];

      // Calculate total attendees across user's events
      const totalAttendees = myEvents.reduce((sum, event) => {
        return sum + (event.currentAttendees || 0);
      }, 0);

      setStats({
        myEvents: myEvents.length,
        myRSVPs: myRSVPs.length,
        totalAttendees
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen={true} text="Loading dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.name}! Manage your events and RSVPs</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">My Events</p>
              <p className="text-3xl font-bold text-gray-900">{stats.myEvents}</p>
            </div>
            <FiCalendar className="text-4xl text-indigo-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">My RSVPs</p>
              <p className="text-3xl font-bold text-gray-900">{stats.myRSVPs}</p>
            </div>
            <FiList className="text-4xl text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Attendees</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalAttendees}</p>
            </div>
            <FiUsers className="text-4xl text-purple-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link
          to="/events/create"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-indigo-500 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">Create Event</h3>
              <p className="text-gray-600 text-sm mt-1">Start a new event</p>
            </div>
            <FiPlus className="text-3xl text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
        </Link>

        <Link
          to="/my-events"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-indigo-500 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">My Events</h3>
              <p className="text-gray-600 text-sm mt-1">View your events</p>
            </div>
            <FiCalendar className="text-3xl text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
        </Link>

        <Link
          to="/my-rsvps"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-indigo-500 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">My RSVPs</h3>
              <p className="text-gray-600 text-sm mt-1">Events you're attending</p>
            </div>
            <FiList className="text-3xl text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
        </Link>

        <Link
          to="/profile"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-indigo-500 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">Profile</h3>
              <p className="text-gray-600 text-sm mt-1">Manage your account</p>
            </div>
            <FiUsers className="text-3xl text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="space-y-3">
          <Link
            to="/events"
            className="block text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
          >
            Browse all events →
          </Link>
          {stats.myEvents > 0 && (
            <Link
              to="/my-events"
              className="block text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
            >
              Manage my events →
            </Link>
          )}
          {stats.myRSVPs > 0 && (
            <Link
              to="/my-rsvps"
              className="block text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
            >
              View my RSVPs →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
