const express = require('express');
const router = express.Router();
const projectCtrl = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { isProjectOwner } = require('../middleware/ownership');

// Public routes
router.get('/', projectCtrl.listProjects);
router.get('/:id', projectCtrl.getProject);

// Protected routes (must be logged in)
router.post('/', protect, projectCtrl.createProject);

// Update project — must be logged in AND be the owner (or admin)
router.put('/:id', protect, isProjectOwner, projectCtrl.updateProject);

// Delete project — must be logged in AND be the owner (or admin)
router.delete('/:id', protect, isProjectOwner, projectCtrl.deleteProject);

module.exports = router;
