// backend/routes/bidRoutes.js
const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/role');
const ctrl = require('../controllers/bidController');

// Bids on a project
router.post('/projects/:projectId', protect, requireRole('freelancer'), ctrl.submitBid);
router.get('/projects/:projectId',  protect, ctrl.listBidsForProject);

// Single bid ops
router.put('/:bidId',       protect, requireRole('freelancer'), ctrl.updateBid);
router.post('/:bidId/accept', protect, requireRole('employer'),  ctrl.acceptBid);

module.exports = router;
