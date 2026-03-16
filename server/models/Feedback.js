const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  type:    { type: String, enum: ['General', 'Bug Report', 'Feature Request', 'Query'], default: 'General' },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Feedback', feedbackSchema);
