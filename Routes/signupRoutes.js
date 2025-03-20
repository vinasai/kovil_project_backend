const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Signup = require('../models/Signup');

// POST route to handle form submission
router.post('/', async (req, res) => {
  try {
    const { firstname, lastname, dob, address,email, password, confirmpassword, familyMembers } = req.body;

    // Validate required fields
    if (!firstname || !lastname || !dob || !address ||!email || !password || !confirmpassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate password match
    if (password !== confirmpassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Check if email already exists
    const existingUser = await Signup.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Validate family members (if any)
    if (familyMembers && familyMembers.length > 0) {
      for (const member of familyMembers) {
        if (!member.name || !member.dob || !member.relationship) {
          return res.status(400).json({ error: 'All fields for family members are required' });
        }
      }
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newSignup = new Signup({
      firstname,
      lastname,
      dob,
      address,
      email,
      password: hashedPassword, // Save hashed password
      familyMembers,
    });

    // Save the user to the database
    await newSignup.save();

    // Send success response
    res.status(201).json({ message: 'Registration saved successfully' });
  } catch (error) {
    console.error(error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    // Handle duplicate key errors (e.g., unique fields)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Handle other errors
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;