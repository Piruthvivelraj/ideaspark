const express = require('express');
const Feedback = require('../models/Feedback');

const router = express.Router();

// Submit feedback (public — no auth required)
router.post('/', async (req, res) => {
  const { name, email, type, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email and message are required.' });
  }
  try {
    await Feedback.create({ name, email, type, message });
    res.status(201).json({ message: 'Feedback submitted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit feedback.' });
  }
});

module.exports = router;
