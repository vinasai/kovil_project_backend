const express = require('express');
const router = express.Router();
const Signup = require('../models/Signup');

// POST route to handle form submission
router.post('/', async (req, res) => {
  try {
    const signupData = req.body;

    // Optional: validate password match
    if (signupData.password !== signupData.confirmpassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const newSignup = new Signup(signupData);
    await newSignup.save();

    res.status(201).json({ message: 'Registration saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
