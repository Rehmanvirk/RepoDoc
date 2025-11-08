// backend/routes/genRoutes.js

const express = require('express');
const router = express.Router();
const {
  createGenerationJob,
  checkGenerationStatus,
} = require('../controllers/genController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/generate
// We use our 'protect' middleware to make this a private route
router.post('/', protect, createGenerationJob);

// GET /api/generate/status/:id
// This is also private
router.get('/status/:id', protect, checkGenerationStatus);

module.exports = router;