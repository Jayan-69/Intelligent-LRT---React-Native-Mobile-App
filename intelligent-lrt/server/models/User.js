const mongoose = require('mongoose');

// NOTE: This is a simplified User model for the backend.
// The frontend has more complex logic for auth state.
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'superAdmin'],
    default: 'user',
  },
  // We won't store passwords directly for now, assuming social auth
  googleId: {
    type: String,
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
