const Project = require('../models/Project');
const mongoose = require('mongoose');

/**
 * Middleware to ensure that the logged-in user is the owner of the project
 * or an admin before allowing update/delete actions.
 */
exports.isProjectOwner = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    // Find project and only get the owner field
    const project = await Project.findById(id).select('owner');
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const ownerId = String(project.owner);
    const userId = String(req.user.id);

    // Allow if the logged-in user is the owner OR has admin role
    if (ownerId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only the project owner can perform this action' });
    }

    // Attach project to request in case the controller needs it
    req.project = project;
    next();
  } catch (e) {
    res.status(500).json({ error: e.message || 'Server error' });
  }
};
