const express = require('express');
const router = express.Router();
const User = require('../models/Signup'); // Import your User model

// Fetch all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from MongoDB
    res.status(200).json(users); // Send the users as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;