// --- Backend: routes/polls.js ---
const express = require("express");
const router = express.Router();
const Poll = require("../models/Poll");

// Handle vote submission
// routes/pollRoutes.js
router.patch('/:id', async (req, res) => {
  const { vote } = req.body;
  const pollId = req.params.id;

  try {
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    if (!poll.votes) poll.votes = {};

    poll.votes[vote] = (poll.votes[vote] || 0) + 1;

    await poll.save();
    res.json({ message: "Vote recorded", poll });
  } catch (err) {
    console.error("Error voting:", err);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;