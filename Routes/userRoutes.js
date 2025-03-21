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

// DELETE route to delete a user by ID
router.delete('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Update a user's family members
router.put('/users/:userId/family-members', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { familyMembers } = req.body; // Expect an array of family members

    // Validate family members
    if (!Array.isArray(familyMembers)) {
      return res.status(400).json({ error: 'Family members must be an array' });
    }

    // Find the user and update their family members
    const user = await User.findByIdAndUpdate(
      userId,
      { familyMembers },
      { new: true } // Return the updated user
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user); // Return the updated user
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;