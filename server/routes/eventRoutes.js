const express = require('express');
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

// Public route - anyone can view events
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Protected routes - require authentication
router.post('/', protect, createEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);
router.get('/user/my-events', protect, getMyEvents);

module.exports = router;