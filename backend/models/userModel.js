// backend/models/userModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  generationsRemaining: {
    type: Number,
    default: 3, // Give every new user 3 free generations
  },

}, {
  // Adds 'createdAt' and 'updatedAt' fields automatically
  timestamps: true,
});

// Before saving a new user, hash their password
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  // Generate a "salt" to make the hash more secure
  const salt = await bcrypt.genSalt(10);
  // Hash the password
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// This adds a custom method to our user model
// We can use it to compare the login password to the saved hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;