const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  domain: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  techStack: [String],
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  savedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Idea', ideaSchema);
