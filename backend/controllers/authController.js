// backend/controllers/authController.js
// Handles user registration and login

const bcrypt = require('bcryptjs');       // For password hashing
const jwt = require('jsonwebtoken');       // For creating tokens
const pool = require('../config/db');      // MySQL connection

// ─────────────────────────────────────────
// REGISTER — POST /api/auth/register
// ─────────────────────────────────────────
const register = async (req, res) => {
  // 1. Get data from request body
  const { name, email, password } = req.body;

  // 2. Basic validation — make sure fields are not empty
  if (!name || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide name, email, and password.' 
    });
  }

  // 3. Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide a valid email address.' 
    });
  }

  // 4. Validate password length
  if (password.length < 6) {
    return res.status(400).json({ 
      success: false, 
      message: 'Password must be at least 6 characters.' 
    });
  }

  try {
    // 5. Check if email already exists in database
    const [existingUser] = await pool.execute(
      'SELECT id FROM users WHERE email = ?', 
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ 
        success: false, 
        message: 'Email already registered. Please login.' 
      });
    }

    // 6. Hash the password (NEVER store plain text passwords!)
    // bcrypt.hash(password, saltRounds) — 10 rounds = secure enough
    const hashedPassword = await bcrypt.hash(password, 10);

    // 7. Insert new user into database
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // 8. Create JWT token for immediate login after registration
    const token = jwt.sign(
      { id: result.insertId, email },   // Payload (data inside token)
      process.env.JWT_SECRET,            // Secret key
      { expiresIn: '7d' }                // Token expires in 7 days
    );

    // 9. Send success response
    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        id: result.insertId,
        name,
        email
      }
    });

  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again.' 
    });
  }
};

// ─────────────────────────────────────────
// LOGIN — POST /api/auth/login
// ─────────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Validate input
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide email and password.' 
    });
  }

  try {
    // 2. Find user by email
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?', 
      [email]
    );

    if (users.length === 0) {
      // User not found — use vague message for security
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password.' 
      });
    }

    const user = users[0];

    // 3. Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password.' 
      });
    }

    // 4. Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 5. Send success response (never send password back!)
    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again.' 
    });
  }
};

// 6. Export both functions
module.exports = { register, login };