const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  pollId: { type: String, required: true, unique: true },
  question: String,
  options: [String],
  votes: Object,
});

module.exports = mongoose.model('Poll', pollSchema);
