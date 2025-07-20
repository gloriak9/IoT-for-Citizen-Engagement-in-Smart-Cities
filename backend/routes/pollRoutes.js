// --- Backend: routes/polls.js ---
const express = require("express");
const router = express.Router();
const Poll = require("../models/Poll");

// Handle vote submission
router.post('/vote', async (req, res) => {
  const { pollId, vote } = req.body;
  try {
    const poll = await Poll.findOne({ pollId });
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    if (!poll.votes[vote]) {
      poll.votes[vote] = 1;
    } else {
      poll.votes[vote]++;
    }

    await poll.save();
    res.json({ message: "Vote recorded", poll });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;