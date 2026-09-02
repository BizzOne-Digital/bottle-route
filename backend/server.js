require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check — deliberately does not depend on DB connectivity, so it
// stays useful as a liveness check even during a DB outage.
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'Bottle Route API' }));

// Ensure a live DB connection on every request, not just on cold start —
// a warm serverless container reuses this module without re-running
// connectDB(), so this is what actually catches & recovers a connection
// that died while the container sat idle.
app.use((req, res, next) => {
  connectDB()
    .then(() => next())
    .catch((err) => {
      console.error('DB connection failed for request:', err.message);
      res.status(503).json({ success: false, message: 'Database temporarily unavailable, please retry' });
    });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/pricing', require('./routes/pricing'));

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
