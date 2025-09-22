const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  tags: [{ type: String, index: true }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, default: 0 },
  votes: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, value: Number }],
  slug: { type: String, index: true },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
