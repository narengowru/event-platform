import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loader from './components/common/Loader';
import Navbar from './components/common/NavBar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import Dashboard from './pages/Dashboard';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import MyEvents from './pages/MyEvents';
import MyRSVPs from './pages/MyRSVPs';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user1');
        console.log('Stored User:', storedUser);
        // Check if storedUser exists and is not the string 'undefined'
        if (storedUser && storedUser !== 'undefined') {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Failed to load user from localStorage:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Listen for storage changes (login/logout events)
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('user1');
      // Check if storedUser exists and is not the string 'undefined'
      if (storedUser && storedUser !== 'undefined') {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.error('Failed to parse user:', err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener('auth-storage-change', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('auth-storage-change', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user1');
    setUser(null);
    window.dispatchEvent(new Event('auth-storage-change'));
  };

  // Show loader while checking authentication
  if (loading) {
    return <Loader fullScreen={true} text="Loading..." />;
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar user={user} onLogout={logout} />

        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={user ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/dashboard" /> : <Register />}
            />
            <Route
              path="/signup"
              element={user ? <Navigate to="/dashboard" /> : <Register />}
            />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute user={user} loading={loading}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/create"
              element={
                <ProtectedRoute user={user} loading={loading}>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/edit/:id"
              element={
                <ProtectedRoute user={user} loading={loading}>
                  <EditEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-events"
              element={
                <ProtectedRoute user={user} loading={loading}>
                  <MyEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-rsvps"
              element={
                <ProtectedRoute user={user} loading={loading}>
                  <MyRSVPs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute user={user} loading={loading}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;