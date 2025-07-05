// routes/history.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const Video = require('../models/Video');

router.get('/', verifyToken, async (req, res) => {
  const email = req.user.email;

  try {
    const videos = await Video.find({ email }).sort({ uploadedAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
