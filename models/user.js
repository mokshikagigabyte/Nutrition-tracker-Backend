const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String // 🔒 For real apps, use bcrypt to hash!
});

module.exports = mongoose.model('User', userSchema);
