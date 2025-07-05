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
You are an assistant that extracts action items from meeting transcripts.

From the transcript below, identify all action items and return them as a raw JSON array.

Each action item must include:
- action: What needs to be done
- assignee: Who is responsible
- deadline: When it should be done

If any information is missing, use the string "Not specified".

⚠️ Do not include any text before or after the JSON.
Do not wrap the response in markdown formatting like \`\`\`json or \`\`\`.
Just return the JSON array only.





Transcript:
${paragraph}
      `,
      stream: false
    });

    let raw = response.data.response?.trim();
console.log("📌 Mistral Action Items (Raw):", raw);

let cleaned = raw;

// ✅ Clean Mistral's markdown code formatting if present
if (cleaned.startsWith('```json') && cleaned.endsWith('```')) {
  cleaned = cleaned.slice(7, -3).trim(); // Remove ```json ... ```
} else if (cleaned.startsWith('```') && cleaned.endsWith('```')) {
  cleaned = cleaned.slice(3, -3).trim(); // Remove generic ``` ... ```
}

let parsedItems;
try {
  parsedItems = JSON.parse(cleaned);

  // ✅ Normalize keys (case-insensitive and fallback)
  parsedItems = parsedItems.map(item => {
    const keys = Object.keys(item);
    const actionKey = keys.find(k => k.toLowerCase() === 'action');
    const assigneeKey = keys.find(k => k.toLowerCase() === 'assignee');
    const deadlineKey = keys.find(k => k.toLowerCase() === 'deadline');

    return {
      action: item[actionKey] || 'Not specified',
      assignee: item[assigneeKey] || 'Not specified',
      deadline: item[deadlineKey] || 'Not specified',
    };
  });

} catch (parseErr) {
  console.error("❌ Failed to parse Mistral JSON:", parseErr);
  return res.status(500).json({ error: 'Invalid JSON format returned from Mistral.' });
}


    await Video.findOneAndUpdate(
      { email, filename },
      {
        email,
        filename,
        transcript: paragraph,
        actionItems: parsedItems
      },
      { upsert: true, new: true }
    );

    res.json({ actionItems: parsedItems });

  } catch (err) {
    console.error("❌ Action item extraction error:", err.message);
    console.error("📄 Full error:", err.response?.data || err);
    res.status(500).json({ error: 'Failed to extract action items' });
  }
});

module.exports = router;
