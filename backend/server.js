// backend/server.js
// This is the HEART of the backend - it starts everything
import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import requestRoutes from './routes/requestRoutes.js';

dotenv.config(); // ← Use this, NOT require('dotenv').config()

// — Middleware (runs on EVERY request) —

// 1. CORS - Allow frontend to call this backend
const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://zepnest-tau.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

// 2. JSON Parser - Allow Express to read JSON request bodies
app.use(express.json());

// 3. Health Check Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Zepnest backend is live',
    db: 'MySQL Connected'
  });
});

// 4. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});