// models/Video.js
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  email: { type: String, required: true },
  filename: { type: String, required: true },
  transcript: { type: String },
  summary: { type: String },
  actionItems: {
    type: [
      {
        action: String,
        assignee: String,
        deadline: String
      }
    ],
    default: []
  },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);
