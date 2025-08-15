const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createPortfolio,
  getMyPortfolio,
  updatePortfolio,
  deletePortfolio
} = require('../controllers/portfolioController');

router.post('/', protect, createPortfolio);
router.get('/my', protect, getMyPortfolio);
router.put('/:id', protect, updatePortfolio);
router.delete('/:id', protect, deletePortfolio);

module.exports = router;
