// reputation helper: applies points to target owner and to voter for engagement
const User = require('../models/User');

const REPUTATION = {
  POST_UPVOTE: 10,
  COMMENT_UPVOTE: 5,
  GIVE_UPVOTE: 2,
  DOWNVOTE_RECEIVED: -2
};

async function applyReputationOnVote({ targetType, targetOwnerId, voteValue, votingUserId }) {
  if (!targetOwnerId) return;
  try {
    if (voteValue === 1) {
      let points = 0;
      if (targetType === 'Post') points = REPUTATION.POST_UPVOTE;
      if (targetType === 'Comment') points = REPUTATION.COMMENT_UPVOTE;
      // give small reward to voter for engaging
      if (votingUserId) await User.findByIdAndUpdate(votingUserId, { $inc: { score: REPUTATION.GIVE_UPVOTE } });
      await User.findByIdAndUpdate(targetOwnerId, { $inc: { score: points } });
    } else if (voteValue === -1) {
      await User.findByIdAndUpdate(targetOwnerId, { $inc: { score: REPUTATION.DOWNVOTE_RECEIVED } });
    }
  } catch (err) {
    console.error('applyReputationOnVote error:', err);
  }
}

module.exports = { applyReputationOnVote, REPUTATION };
