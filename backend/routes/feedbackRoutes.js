const express = require('express');
const multer = require('multer');
const Feedback = require('../models/Feedback'); // adjust path

const router = express.Router();

// Only handle text fields, no file upload for now
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.none(), async (req, res) => {
  try {
    const {
      category,
      locationDescription,
      timeOfIncident,
      severity,
      description,
      name,
      email,
      appVersion
    } = req.body;

    const feedback = new Feedback({
      category,
      locationDescription,
      timeOfIncident: timeOfIncident ? new Date(timeOfIncident) : undefined,
      severity,
      description,
      name,
      email,
      appVersion
    });

    await feedback.save();
    res.status(201).json({ message: 'Feedback saved successfully', feedback });

  } catch (err) {
    console.error("Save failed:", err.message, err.errors);
    res.status(400).json({ error: err.message, details: err.errors });
  }
});

module.exports = router;
