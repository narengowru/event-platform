const RSVP = require('../models/RSVP');
const Event = require('../models/Event');
const mongoose = require('mongoose');

// @desc    RSVP to an event (with concurrency handling)
// @route   POST /api/rsvp/:eventId
// @access  Private
exports.rsvpToEvent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Check if event exists
    const event = await Event.findById(eventId).session(session);
    if (!event) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user already has an RSVP
    const existingRSVP = await RSVP.findOne({ user: userId, event: eventId }).session(session);
    if (existingRSVP) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'You have already RSVP\'d to this event' });
    }

    // Check capacity with atomic update
    if (event.currentAttendees >= event.capacity) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Event is at full capacity' });
    }

    // Create RSVP
    const rsvp = await RSVP.create([{
      user: userId,
      event: eventId,
      status: 'confirmed',
    }], { session });

    // Increment currentAttendees atomically
    await Event.findByIdAndUpdate(
      eventId,
      { $inc: { currentAttendees: 1 } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      data: rsvp[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel RSVP
// @route   DELETE /api/rsvp/:eventId
// @access  Private
exports.cancelRSVP = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Find RSVP
    const rsvp = await RSVP.findOne({ user: userId, event: eventId }).session(session);
    if (!rsvp) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'RSVP not found' });
    }

    // Delete RSVP
    await RSVP.findByIdAndDelete(rsvp._id, { session });

    // Decrement currentAttendees atomically
    await Event.findByIdAndUpdate(
      eventId,
      { $inc: { currentAttendees: -1 } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'RSVP cancelled successfully',
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendees for an event
// @route   GET /api/rsvp/event/:eventId
// @access  Private
exports.getEventAttendees = async (req, res) => {
  try {
    const { eventId } = req.params;

    const rsvps = await RSVP.find({ event: eventId, status: 'confirmed' })
      .populate('user', 'name email');

    res.status(200).json({
      success: true,
      count: rsvps.length,
      data: rsvps,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's RSVPs
// @route   GET /api/rsvp/my-rsvps
// @access  Private
exports.getMyRSVPs = async (req, res) => {
  try {
    const userId = req.user.id;

    const rsvps = await RSVP.find({ user: userId, status: 'confirmed' })
      .populate('event');

    res.status(200).json({
      success: true,
      count: rsvps.length,
      data: rsvps,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};