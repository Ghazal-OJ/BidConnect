const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const { isProjectOwner } = require('../middleware/ownership');
const ctrl = require('../controllers/projectController');

router.post('/', protect, requireRole('employer'), ctrl.createProject);
router.get('/', ctrl.listProjects);
router.get('/:id', ctrl.getProject);
router.put('/:id', protect, requireRole('employer'), isProjectOwner, ctrl.updateProject);
router.delete('/:id', protect, requireRole('employer'), isProjectOwner, ctrl.deleteProject);

module.exports = router;
