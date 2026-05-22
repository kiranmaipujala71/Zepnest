// backend/controllers/requestController.js
// Handles all service request operations

const pool = require('../config/db');

// ─────────────────────────────────────────
// CREATE REQUEST — POST /api/requests
// ─────────────────────────────────────────
const createRequest = async (req, res) => {
  // req.user is set by our auth middleware (contains id from JWT)
  const userId = req.user.id;
  const { title, description, category, address, preferred_time } = req.body;

  // Validation
  if (!title || !description || !category || !address || !preferred_time) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please fill in all required fields.' 
    });
  }

  // Handle optional image upload (multer puts file info in req.file)
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const [result] = await pool.execute(
      `INSERT INTO service_requests 
        (user_id, title, description, category, address, preferred_time, image_url, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [userId, title, description, category, address, preferred_time, imageUrl]
    );

    // Fetch the created request to return it
    const [newRequest] = await pool.execute(
      'SELECT * FROM service_requests WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Service request created successfully!',
      data: newRequest[0]
    });

  } catch (err) {
    console.error('Create Request Error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─────────────────────────────────────────
// GET ALL REQUESTS (for logged-in user) — GET /api/requests
// ─────────────────────────────────────────
const getRequests = async (req, res) => {
  const userId = req.user.id;

  try {
    // Get only this user's requests, newest first
    const [requests] = await pool.execute(
      'SELECT * FROM service_requests WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });

  } catch (err) {
    console.error('Get Requests Error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─────────────────────────────────────────
// GET SINGLE REQUEST — GET /api/requests/:id
// ─────────────────────────────────────────
const getRequestById = async (req, res) => {
  const userId = req.user.id;
  const requestId = req.params.id; // :id from URL

  try {
    const [requests] = await pool.execute(
      'SELECT * FROM service_requests WHERE id = ? AND user_id = ?',
      [requestId, userId]
    );

    if (requests.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Request not found or you do not have permission.' 
      });
    }

    res.status(200).json({ success: true, data: requests[0] });

  } catch (err) {
    console.error('Get Request Error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─────────────────────────────────────────
// UPDATE REQUEST STATUS — PATCH /api/requests/:id/status
// ─────────────────────────────────────────
const updateRequestStatus = async (req, res) => {
  const userId = req.user.id;
  const requestId = req.params.id;
  const { status } = req.body;

  // Validate status value
  const allowedStatuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({ 
      success: false, 
      message: `Status must be one of: ${allowedStatuses.join(', ')}` 
    });
  }

  try {
    // Check this request belongs to the user
    const [existing] = await pool.execute(
      'SELECT id FROM service_requests WHERE id = ? AND user_id = ?',
      [requestId, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Request not found or you do not have permission.' 
      });
    }

    // Update the status
    await pool.execute(
      'UPDATE service_requests SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, requestId]
    );

    const [updated] = await pool.execute(
      'SELECT * FROM service_requests WHERE id = ?',
      [requestId]
    );

    res.status(200).json({
      success: true,
      message: 'Status updated successfully!',
      data: updated[0]
    });

  } catch (err) {
    console.error('Update Status Error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─────────────────────────────────────────
// DELETE REQUEST — DELETE /api/requests/:id
// ─────────────────────────────────────────
const deleteRequest = async (req, res) => {
  const userId = req.user.id;
  const requestId = req.params.id;

  try {
    // Only delete if it belongs to this user
    const [result] = await pool.execute(
      'DELETE FROM service_requests WHERE id = ? AND user_id = ?',
      [requestId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Request not found or you do not have permission.' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Request deleted successfully.' 
    });

  } catch (err) {
    console.error('Delete Request Error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { 
  createRequest, 
  getRequests, 
  getRequestById, 
  updateRequestStatus, 
  deleteRequest 
};