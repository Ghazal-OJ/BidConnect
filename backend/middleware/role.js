// backend/middleware/role.js
module.exports.requireRole = (...allowed) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    console.log('[requireRole] need:', allowed, 'got:', req.user.role); // 👈 دیباگ
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }
    next();
  };
};
