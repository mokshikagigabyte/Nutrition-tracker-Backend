// In backend (Node.js Express):
const axios = require('axios');

app.post('/recipes', async (req, res) => {
  const { ingredients } = req.body;

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

    const content = groqResponse.data.choices[0].message.content;
    // Parse if needed or just return
    res.json([{ name: 'Groq AI Recipe', ingredients: [ingredients], instructions: content }]);
  } catch (err) {
    console.error('Groq API Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate recipes' });
  }
});
