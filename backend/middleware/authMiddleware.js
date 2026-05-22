// backend/middleware/authMiddleware.js
// This "guard" checks every protected route for a valid JWT token

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // 1. Get the token from request headers
  // Tokens are sent as: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token found → reject the request
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized. No token provided.' 
    });
  }

  // 2. Extract the token (remove "Bearer " prefix)
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Attach user info to request so controllers can use it
    req.user = decoded; // decoded = { id: 5, email: 'user@example.com', iat: ..., exp: ... }
    
    // 5. Call next() to proceed to the actual route handler
    next();
  } catch (err) {
    // Token is invalid or expired
    return res.status(401).json({ 
      success: false, 
      message: 'Token is invalid or expired. Please login again.' 
    });
  }
};

module.exports = { protect };