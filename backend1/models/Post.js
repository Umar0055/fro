import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  votes: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    value: { type: Number, enum: [1, -1] } // Restrict to +1 or -1
  }],
  comments: [{
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Add a virtual field for total votes
PostSchema.virtual('totalVotes').get(function() {
  return this.votes.reduce((sum, vote) => sum + vote.value, 0);
});

// Ensure virtuals are included when converting to JSON
PostSchema.set('toJSON', { virtuals: true });
PostSchema.set('toObject', { virtuals: true });

export default mongoose.model('Post', PostSchema);
