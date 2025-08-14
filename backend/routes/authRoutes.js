const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const {
  registerUser,
  loginUser,
  updateUserProfile,
  getProfile,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
