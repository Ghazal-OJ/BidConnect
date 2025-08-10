const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware'); // ← این خط
const ctrl = require('../controllers/projectController');

router.post('/', protect, ctrl.createProject);   // ← protect به‌جای auth
router.get('/', ctrl.listProjects);
router.get('/:id', ctrl.getProject);
router.put('/:id', protect, ctrl.updateProject); // ← protect
router.delete('/:id', protect, ctrl.deleteProject); // ← protect

module.exports = router;
