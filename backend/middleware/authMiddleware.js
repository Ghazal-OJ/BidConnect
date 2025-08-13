const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware: Protect routes that require authentication
 * - Checks for a valid JWT token in the Authorization header
 * - Decodes the token to get the user ID
 * - Loads the user from the database (without password)
 * - Adds the user object to req.user
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Check if token exists in Authorization header (format: "Bearer <token>")
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Extract token string

      // 2. Verify token using secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Fetch user from DB and attach to request object (exclude password field)
      req.user = await User.findById(decoded.id).select('-password');

      return next(); // Proceed to next middleware or route
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  // 4. If no token found
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
