const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: String, required: true }, // Storing as a string for easy manipulation
    time: { type: String, required: true }
});

module.exports = mongoose.model('Event', EventSchema);
