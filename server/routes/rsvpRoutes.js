const express = require('express');
const router = express.Router();
const {
  rsvpToEvent,
  cancelRSVP,
  getEventAttendees,
  getMyRSVPs,
} = require('../controllers/rsvpController');
const { protect } = require('../middleware/authMiddleware');

// All RSVP routes require authentication
router.post('/:eventId', protect, rsvpToEvent);
router.delete('/:eventId', protect, cancelRSVP);
router.get('/event/:eventId', protect, getEventAttendees);
router.get('/my-rsvps', protect, getMyRSVPs);

module.exports = router;