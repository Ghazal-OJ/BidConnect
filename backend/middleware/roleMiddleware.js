// middleware/roleMiddleware.js
// Only allow specific user roles to access a route
module.exports = function requireRole(...allowedRoles) {
  return (req, res, next) => {
    // User not logged in
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: please log in first' });
    }

    // Role not allowed for this action
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: your account type cannot perform this action' });
    }

    next();
  };
};
