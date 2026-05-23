// backend/server.js
// This is the HEART of the backend — it starts everything
import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import requestRoutes from './routes/requestRoutes.js';

dotenv.config(); // Load .env variables

// Create Express app
const app = express();

// --- Middleware --- MUST be before routes
// 1. CORS - Allow frontend to call this backend
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://zepnest-tau.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});