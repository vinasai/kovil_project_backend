const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  donationDate: {
    type: Date,
    default: Date.now
  }
});

const Donor = mongoose.model('Donor', donorSchema);

module.exports = Donor;
