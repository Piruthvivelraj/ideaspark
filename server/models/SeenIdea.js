const mongoose = require('mongoose');

const seenIdeaSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  domain: { type: String, required: true },
  title: { type: String, required: true },
  seenAt: { type: Date, default: Date.now },
});

seenIdeaSchema.index({ userId: 1, domain: 1, title: 1 }, { unique: true });

module.exports = mongoose.model('SeenIdea', seenIdeaSchema);
