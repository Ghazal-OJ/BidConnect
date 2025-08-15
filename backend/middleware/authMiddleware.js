const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('_id name email role');
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
