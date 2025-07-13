const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  location: {
    lat: Number,
    lng: Number
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
