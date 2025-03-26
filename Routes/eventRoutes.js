const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Create an event (Admin Only)
router.post('/add', async (req, res) => {
    try {
        const { title, description, date, time } = req.body;
        const newEvent = new Event({ title, description, date, time });
        await newEvent.save();
        res.status(201).json({ message: 'Event added successfully', event: newEvent });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add event' });
    }
});

// Fetch all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Update an event (Admin Only)
router.put('/update/:id', async (req, res) => {
    try {
        const { title, description, date, time } = req.body;
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, { title, description, date, time }, { new: true });
        res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update event' });
    }
});

// Delete an event (Admin Only)
router.delete('/delete/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete event' });
    }
});
// Get all upcoming events
router.get('/upcoming-events', async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0]; // Today's date
      const events = await Event.find({ date: { $gte: today } }).sort({ date: 1 });
      res.json(events);
    } catch (err) {
      console.error('Error fetching events:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

module.exports = router;

