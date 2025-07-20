// --- Backend: models/Poll.js ---
const mongoose = require("mongoose");

const PollSchema = new mongoose.Schema({
  pollId: { type: String, required: true, unique: true },
  question: String,
  options: [String],
  votes: { type: Map, of: Number },
});

module.exports = mongoose.model("Poll", PollSchema);