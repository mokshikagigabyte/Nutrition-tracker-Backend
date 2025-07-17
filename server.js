const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // ✅ For .env file (if you use it)

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ✅ MongoDB (you can comment if not needed)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Mongoose connected'))
  .catch((err) => console.error('MongoDB Error:', err));

// ✅ Register Endpoint
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  // Add logic to save user to MongoDB (or skip if not required)
  res.json({ message: 'Registered successfully' });
});

// ✅ Login Endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // Add user validation (simplified here)
  res.json({ message: 'Login successful' });
});

// ✅ Recipes Endpoint using Groq API
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
            content: `Suggest 3 healthy recipes I can make with these ingredients: ${ingredients}. Include ingredients and simple instructions for each recipe.`
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

    res.json([
      {
        name: "Groq AI Recipe Suggestion",
        ingredients: [ingredients],
        instructions: content
      }
    ]);
  } catch (error) {
    console.error('Groq API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch recipes from Groq API' });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
