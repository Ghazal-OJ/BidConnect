// middleware/ownership.js
const Project = require('../models/Project');

// Allow only the owner (employer who created the project)
async function isProjectOwner(req, res, next) {
  try {
    const project = await Project.findById(req.params.id).select('owner');
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied: you do not own this project' });
    }

    // Attach for later use if needed
    req.project = project;
    next();
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

module.exports = { isProjectOwner };
