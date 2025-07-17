const express = require('express');
const axios = require('axios');
const router = express.Router();

// ✅ POST /recipes — Get recipes from Groq AI
router.post('/', async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients || typeof ingredients !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing ingredients' });
  }

  try {
    const groqResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: `Suggest 3 healthy recipes I can make with these ingredients: ${ingredients}. Include ingredients and simple instructions.`
          }
        ]
      },
      {
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json'
        }
      }
    );

    const aiMessage = groqResponse.data.choices[0].message.content;

    // Return in structured format if needed
    res.json([
      {
        name: 'AI Suggested Recipes',
        ingredients: [ingredients],
        instructions: aiMessage
      }
    ]);
  } catch (error) {
    console.error('Groq API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch recipes from Groq API' });
  }
});

module.exports = router;
