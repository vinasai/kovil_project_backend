const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  imageUrl: { type: String, default: '' },
  date:{
    type: String, default: '' 

  },
  amount: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,  // You can change this to Date if it's a specific time
  },
  days: {
    type: [String], // Store multiple days in an array
    required: true,
  },
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
