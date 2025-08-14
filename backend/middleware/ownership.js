// backend/middleware/ownership.js
const Project = require('../models/Project');

exports.isProjectOwner = async (req, res, next) => {
  try {
    const proj = await Project.findById(req.params.id).select('owner');
    if (!proj) return res.status(404).json({ error: 'Project not found' });
    if (proj.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only project owner can perform this action' });
    }
    next();
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
