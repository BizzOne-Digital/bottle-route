require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to DB
connectDB().catch((err) => console.error('Initial DB connection failed:', err.message));

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/pricing', require('./routes/pricing'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'Bottle Route API' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Server error' });
});

// Vercel imports this file as a serverless function (see vercel.json) —
// only bind a port when run directly, e.g. `node server.js` / `npm run dev`.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Bottle Route API running on port ${PORT}`));
}

module.exports = app;
