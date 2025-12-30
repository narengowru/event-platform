// src/components/common/Footer.jsx
import { Link } from 'react-router-dom';
import { FiCalendar, FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:justify-between gap-8">
          {/* Brand Section */}
          <div className="md:max-w-md">
            <div className="flex items-center space-x-2 mb-4">
              <FiCalendar className="text-3xl text-indigo-500" />
              <span className="text-2xl font-bold text-white">EventHub</span>
            </div>
            <p className="text-gray-400 mb-4">
              Create, manage, and attend amazing events. Connect with people who share your interests.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-indigo-500 transition"
                aria-label="GitHub"
              >
                <FiGithub className="text-2xl" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-indigo-500 transition"
                aria-label="LinkedIn"
              >
                <FiLinkedin className="text-2xl" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-indigo-500 transition"
                aria-label="Twitter"
              >
                <FiTwitter className="text-2xl" />
              </a>
              <a
                href="mailto:contact@eventhub.com"
                className="text-gray-400 hover:text-indigo-500 transition"
                aria-label="Email"
              >
                <FiMail className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Quick Links - Aligned to Right */}
          <div className="md:ml-auto">
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-gray-400 hover:text-indigo-500 transition">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/events/create" className="text-gray-400 hover:text-indigo-500 transition">
                  Create Event
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-indigo-500 transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/my-rsvps" className="text-gray-400 hover:text-indigo-500 transition">
                  My RSVPs
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          {/* <div>
            <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-indigo-500 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-indigo-500 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-indigo-500 transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-indigo-500 transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div> */}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} EventHub. All rights reserved. Built with ❤️ for the community.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;