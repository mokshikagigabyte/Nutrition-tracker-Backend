const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const { ingredients } = req.body;

    const mockRecipes = [
        {
            name: 'Simple Salad',
            ingredients: ['Lettuce', 'Tomato', 'Cucumber'],
            instructions: 'Chop and mix all ingredients. Add salt and lemon.'
        },
        {
            name: 'Rice and Beans',
            ingredients: ['Rice', 'Beans', 'Onion'],
            instructions: 'Cook rice, fry beans with onion, and mix.'
        }
    ];

    const inputIngredients = ingredients.map(i => i.toLowerCase());
    const filteredRecipes = mockRecipes.filter(recipe =>
        recipe.ingredients.some(ing =>
            inputIngredients.some(input => ing.toLowerCase().includes(input))
        )
    );

    res.json(filteredRecipes);
});

module.exports = router;
