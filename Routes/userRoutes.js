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

// Delete a user by ID
router.delete('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; // Get the userId from the request parameters

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the user
    await User.findByIdAndDelete(userId); // Delete the user from MongoDB
    res.status(200).json({ message: 'User deleted successfully' }); // Send a success response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;