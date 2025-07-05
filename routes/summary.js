const express = require('express');
const router = express.Router();
const axios = require('axios');
const verifyToken = require('../middleware/verifyToken');
const Video = require('../models/Video');

router.post('/', verifyToken, async (req, res) => {
  const { paragraph, filename } = req.body;
  const email = req.user.email;

  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: "mistral:7b-instruct-q2_K",
      prompt: `
You are an AI assistant that summarizes meeting transcripts.

From the following transcript, extract and summarize the key points discussed in the meeting. Include:

1. 📌 Main topics covered  
2. ✅ Important decisions made  
3. 🔄 Suggestions or ideas discussed  
4. 📅 Any agreed follow-ups or deadlines (if any)

Provide your output in clear bullet points or short paragraphs.

Transcript:
${paragraph}
      `,
      stream: false
    });

    const summary = response.data.response;
    console.log("🧠 Llama Summary:", summary);

    await Video.findOneAndUpdate(
      { email, filename },
      { email, filename, transcript: paragraph, summary },
      { upsert: true, new: true }
    );

    res.json({ summary });

  } catch (err) {
    console.error("❌ Summary error:", err.message);
    res.status(500).json({ error: 'Failed to summarize' });
  }
});

module.exports = router;
