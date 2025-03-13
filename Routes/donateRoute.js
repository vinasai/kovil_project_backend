const express = require('express');
const router = express.Router();
const Donor = require('../models/Donar');

// POST route to handle donor form submission
router.post('/donate', async (req, res) => {
  try {
    const { name, email, amount, message } = req.body;

    const newDonor = new Donor({
      name,
      email,
      amount,
      message
    });

    await newDonor.save();
    res.status(201).json({ message: 'Donation received successfully!', donor: newDonor });
  } catch (error) {
    res.status(500).json({ message: 'Error processing donation', error });
  }
});

// GET route to fetch all donations
router.get('/donations', async (req, res) => {
    try {
      const donations = await Donor.find();
      res.status(200).json(donations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching donations', error });
    }
  });

 


module.exports = router;
