const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/bidController');

// روی یک پروژه خاص:
router.post('/projects/:projectId', protect, ctrl.submitBid);
router.get('/projects/:projectId', protect, ctrl.listBidsForProject);

// عملیات روی خود بید:
router.put('/:bidId', protect, ctrl.updateBid);
router.post('/:bidId/accept', protect, ctrl.acceptBid);

module.exports = router;
