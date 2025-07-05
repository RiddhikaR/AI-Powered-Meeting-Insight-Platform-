const express=require('express')
const router=express.Router()
const axios=require('axios')

router.post('/', async (req, res) => {
  const paragraph = req.body.paragraph;

  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: "mistral:7b-instruct-q4_0",
      prompt: `translate this paragraph to french\n\n${paragraph}`,
      stream: false
    });

    let raw = response.data.response;
    console.log("🧠 Llama Summary:", raw);

    res.json({ summary: raw });

  } catch (err) {
    console.error("❌ Ollama Error:", err.message);
    res.status(500).json({ error: 'Failed to summarize' });
  }
});

module.exports=router