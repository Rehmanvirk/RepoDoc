// backend/models/generationModel.js

const mongoose = require('mongoose');

const generationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  repoUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  },
  generatedReadme: {
    type: String,
    default: '',
  },
  error: {
    type: String,
  },
}, {
  timestamps: true,
});

const Generation = mongoose.model('Generation', generationSchema);

module.exports = Generation;