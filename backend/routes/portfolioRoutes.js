const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createPortfolio,
  getMyPortfolio,
  updatePortfolio,
  deletePortfolio
} = require('../controllers/portfolioController');

router.post('/', protect, createPortfolio); // فقط فریلنسر
router.get('/my', protect, getMyPortfolio); // فقط کاربر لاگین کرده
router.put('/:id', protect, updatePortfolio);
router.delete('/:id', protect, deletePortfolio);

module.exports = router;
