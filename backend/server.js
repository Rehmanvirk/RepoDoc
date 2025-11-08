// backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors'); // --- 1. Import cors ---

const authRoutes = require('./routes/authRoutes');
const genRoutes = require('./routes/genRoutes');

dotenv.config();
connectDB();

const app = express();

// --- 2. Use cors middleware ---
// This will allow all cross-origin requests
// For production, you'd restrict it: app.use(cors({ origin: 'https://your-frontend.com' }))
app.use(cors());

app.use(express.json());

// ... (rest of your file) ...

app.get('/api/test', (req, res) => {
  res.json({ message: 'Welcome to the RepoDoc.ai API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/generate', genRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});