// backend/routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db= require('../config/db');
const { protect } = require('../middleware/authMiddleware');
const {storage}=require('../cloudinary');
const {
  createRequest,
  getRequests,
  getRequestById,
  updateRequestStatus,
  deleteRequest
} = require('../controllers/requestController');

// ── Multer Configuration (File Upload) ──
// Configure where and how to save uploaded files

 // Create unique filename: timestamp-originalname  
// Only allow image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (isValid) {
    cb(null, true);  // Accept the file
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Max 5MB
});

// ── Routes (all protected — require JWT token) ──
router.post('/', protect, upload.single('image'), createRequest);  // Create
router.get('/', protect, getRequests);                              // Get all
router.get('/:id', protect, getRequestById);                       // Get one
router.patch('/:id/status', protect, updateRequestStatus);         // Update status
router.delete('/:id', protect, deleteRequest);                     // Delete


module.exports = router;
