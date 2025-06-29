const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment.js');

// POST a comment
router.post('/', async (req, res) => {
  try {
    const comment = new Comment(req.body);
    const saved = await comment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
