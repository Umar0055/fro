import mongoose from 'mongoose';

const VoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  value: { type: Number }
}, { _id: false });

const CommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  content: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  votes: [VoteSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Comment', CommentSchema);
