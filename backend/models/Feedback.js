const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: [
      'General Feedback',
      'Safety Concern',
      'Lighting Issue',
      'Infrastructure Issue',
      'Accessibility Concern',
      'Noise / Disturbance',
      'App Feedback',
      'Other'
    ],
    required: true
  },
  locationDescription: {
    type: String,
    default: ''
  },
  timeOfIncident: {
    type: Date
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  description: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  appVersion: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
