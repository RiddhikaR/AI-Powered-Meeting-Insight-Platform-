const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const verifyToken=require('../middleware/verifyToken')
const { exec } = require('child_process');

router.post('/',verifyToken, (req, res) => {
  console.log("✅ POST /gettranscript hit");

  if (!req.files || !req.files.video) {
    return res.status(400).json({ error: 'No video file uploaded' });
  }

  const video = req.files.video;
  const uploadPath = path.join(__dirname, '../../uploads', video.name);

  console.log("📁 File name:", video.name);
  console.log("📏 File size:", video.size);

  video.mv(uploadPath, err => {
    if (err) {
      console.error("❌ Move failed:", err);
      return res.status(500).json({ error: 'Failed to save video file' });
    }

    exec(`python transcribe.py "${uploadPath}"`, (error, stdout, stderr) => {
      fs.unlinkSync(uploadPath); // cleanup

      if (error) {
        console.error("❌ Exec error:", error);
        return res.status(500).json({ error: 'Transcription failed' });
      }

      res.json({ transcript: stdout });
    });
  });
});

module.exports = router;
