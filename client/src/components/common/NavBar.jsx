// src/components/common/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiCalendar, FiLogOut, FiUser, FiPlusCircle, FiList } from 'react-icons/fi';

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold text-indigo-600 hover:text-indigo-700 transition"
            onClick={closeMenu}
          >
            <FiCalendar className="text-2xl" />
            <span>EventHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/events" 
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Browse Events
            </Link>

            {user ? (
              <>
                <Link 
                  to="/events/create" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 font-medium transition"
                >
                  <FiPlusCircle />
                  <span>Create Event</span>
                </Link>

                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 font-medium transition"
                >
                  <FiList />
                  <span>Dashboard</span>
                </Link>

                <div className="flex items-center space-x-4 border-l pl-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <FiUser className="text-indigo-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{user.name}</span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-indigo-600 font-medium transition"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-700 hover:text-indigo-600 focus:outline-none"
          >
            {isMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t mt-2">
            <div className="flex flex-col space-y-3 pt-4">
              <Link 
                to="/events" 
                className="text-gray-700 hover:text-indigo-600 font-medium py-2 transition"
                onClick={closeMenu}
              >
                Browse Events
              </Link>

              {user ? (
                <>
                  <Link 
                    to="/events/create" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 font-medium py-2 transition"
                    onClick={closeMenu}
                  >
                    <FiPlusCircle />
                    <span>Create Event</span>
                  </Link>

                  <Link 
                    to="/dashboard" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 font-medium py-2 transition"
                    onClick={closeMenu}
                  >
                    <FiList />
                    <span>Dashboard</span>
                  </Link>

                  <div className="border-t pt-3 mt-2">
                    <div className="flex items-center space-x-2 py-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <FiUser className="text-indigo-600" />
                      </div>
                      <span className="text-gray-700 font-medium">{user.name}</span>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition mt-2"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-2 border-t pt-3 mt-2">
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-indigo-600 font-medium py-2 transition text-center"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-center"
                    onClick={closeMenu}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;