const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients || !Array.isArray(ingredients)) {
    return res.status(400).json({ error: 'Ingredients must be an array' });
  }

  const ingredientText = ingredients.join(', ');

  try {
    const groqResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: `
You are a recipe suggestion expert. Generate 5 unique and healthy recipes using the following ingredients: ${ingredientText}.
For each recipe, return in this exact format:

Title: <Recipe Name>
Ingredients:
- item 1
- item 2
Instructions:
1. Step one
2. Step two
(Use line breaks to separate each recipe)
`
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

    const aiText = groqResponse.data.choices[0].message.content;

    // Split the text into recipe blocks
    const recipeBlocks = aiText.split(/Title:\s*/).filter(Boolean);

    const recipes = recipeBlocks.map(block => {
      const titleMatch = block.match(/^(.+?)\n/);
      const title = titleMatch ? titleMatch[1].trim() : 'Untitled';

      const ingredientsMatch = block.match(/Ingredients:\s*([\s\S]*?)Instructions:/);
      const instructionsMatch = block.match(/Instructions:\s*([\s\S]*)/);

      const ingredients = ingredientsMatch
        ? ingredientsMatch[1].trim().split('\n').map(i => i.replace(/^-/, '').trim())
        : [];

      const instructions = instructionsMatch
        ? instructionsMatch[1].trim().split('\n').map(i => i.replace(/^\d+\./, '').trim())
        : [];

      return { title, ingredients, instructions };
    });

    res.json({ recipes });
  } catch (error) {
    console.error('Groq API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch recipes from Groq API' });
  }
});

module.exports = router;
