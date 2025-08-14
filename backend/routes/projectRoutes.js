// backend/routes/projectRoutes.js
const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
// const { requireRole } = require('../middleware/role'); // ⛔️ موقتاً نیاز نیست
const { isProjectOwner } = require('../middleware/ownership');
const ctrl = require('../controllers/projectController');

/**
 * Public reads
 */
router.get('/', ctrl.listProjects);
router.get('/:id', ctrl.getProject);

/**
 * Create / Update / Delete
 * - ⬇️ موقت: هر کاربر لاگین‌شده می‌تواند پروژه بسازد
 * - ویرایش/حذف فقط توسط "همان مالک" (isProjectOwner) مجاز است
 */
router.post('/', protect, /* requireRole('employer'), */ ctrl.createProject);
router.put('/:id', protect, /* requireRole('employer'), */ isProjectOwner, ctrl.updateProject);
router.delete('/:id', protect, /* requireRole('employer'), */ isProjectOwner, ctrl.deleteProject);

module.exports = router;
