// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// --- helpers ---
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });


const ALLOWED_ROLES = ['employer', 'freelancer'];
const normalizeRole = (r) => {
  const v = String(r || '').toLowerCase().trim();
  return ALLOWED_ROLES.includes(v) ? v : 'freelancer'; 
};

// ========== POST /api/auth/register ==========
const registerUser = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').toLowerCase().trim();
    const password = String(req.body.password || '');
    const role = normalizeRole(req.body.role);

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'User already exists' });

    const user = await User.create({ name, email, password, role });
    return res.status(201).json({
      token: generateToken(user.id),
      user: { id: user.id, name: user.name, email: user.email, role: user.role, portfolio: user.portfolio }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

// ========== POST /api/auth/login ==========
const loginUser = async (req, res) => {
  try {
    const email = String(req.body.email || '').toLowerCase().trim();
    const password = String(req.body.password || '');

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    const ok = user && (await bcrypt.compare(password, user.password));
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' });

    return res.json({
      token: generateToken(user.id),
      user: { id: user.id, name: user.name, email: user.email, role: user.role, portfolio: user.portfolio }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

// ========== GET /api/auth/profile ==========
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      portfolio: user.portfolio
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

// ========== PUT /api/auth/profile ==========
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const name = req.body.name;
    const email = req.body.email && String(req.body.email).toLowerCase().trim();

    if (name !== undefined) user.name = String(name).trim() || user.name;
    if (email !== undefined) user.email = email || user.email;

    
    if (user.role === 'freelancer' && req.body.portfolio && typeof req.body.portfolio === 'object') {
     
      const current = (user.portfolio && user.portfolio.toObject && user.portfolio.toObject()) || user.portfolio || {};
      user.portfolio = { ...current, ...req.body.portfolio };
    }

    const saved = await user.save();

    return res.json({
      token: generateToken(saved.id),
      user: {
        id: saved.id,
        name: saved.name,
        email: saved.email,
        role: saved.role,
        portfolio: saved.portfolio
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

// ========== POST /api/auth/forgot-password ==========
const forgotPassword = async (req, res) => {
  try {
    const email = String(req.body.email || '').toLowerCase().trim();
    const genericMsg = { message: 'If this email exists, password reset instructions have been sent.' };

    const user = await User.findOne({ email });
    if (!user) return res.json(genericMsg);

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 30; 
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    console.log('Password reset link:', resetLink);

    return res.json(genericMsg);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
};

// ========== POST /api/auth/reset-password ==========
const resetPassword = async (req, res) => {
  try {
    const token = String(req.body.token || '');
    const newPassword = String(req.body.newPassword || '');

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and newPassword are required' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ message: 'Password updated successfully' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword
};
