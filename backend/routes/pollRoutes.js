const express = require('express');
const multer = require('multer');
const Poll = require('../models/Poll'); // Adjust path to your Poll model

const router = express.Router();

// Only handle text fields, no file upload
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.none(), async (req, res) => {
  try {
    const {
      question,
      answer,
      name,
      email,
      appVersion
    } = req.body;

    const poll = new Poll({
      question,
      answer,
      name,
      email,
      appVersion
    });

    await poll.save();
    res.status(201).json({ message: 'Poll response saved successfully', poll });
  } catch (err) {
    console.error("Save failed:", err.message, err.errors);
    res.status(400).json({ error: err.message, details: err.errors });
  }
});

module.exports = router;