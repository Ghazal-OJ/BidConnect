// routes/portfolioRoutes.js
const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/portfolioController');

// Get my portfolio (freelancer only)
router.get('/me', protect, requireRole('freelancer'), ctrl.getMyPortfolio);

// Update my portfolio (freelancer only)
router.put('/me', protect, requireRole('freelancer'), ctrl.updateMyPortfolio);

module.exports = router;
