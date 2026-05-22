// backend/server.js
// This is the HEART of the backend — it starts everything

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Load .env variables

// Import routes
const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');

// Create Express app
const app = express();

// ── Middleware (runs on EVERY request) ──

// 1. CORS — Allow frontend (localhost:5173) to call this backend
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

// 2. JSON Parser — Allow Express to read JSON request bodies
app.use(express.json());

// 3. URL Encoded Parser — For form submissions
app.use(express.urlencoded({ extended: true }));
  
  // 4. Static Files - Serve uploaded images
 // If someone requests /uploads/image.jpg, send the file
 app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  
  // --- Health Check Route ---
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Zepnest backend is live',
      db: 'MySQL Connected'
    });
  });
 
  // --- API Routes ---
  app.use('/api/auth', authRoutes);
  app.use('/api/requests', requestRoutes);
// ── 404 Handler — for unknown routes ──
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.originalUrl} not found.` 
  });
});

// ── Global Error Handler ──
app.use((err, req, res, next) => {
  console.error('Global Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.'
  });
});

// ── Start Server ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Zepnest backend running at http://localhost:${PORT}`);
});
