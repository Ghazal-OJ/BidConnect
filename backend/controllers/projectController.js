const Project = require('../models/Project');

/**
 * Create a new project.
 * - Owner is always set to the currently logged-in user.
 */
exports.createProject = async (req, res) => {
  try {
    const payload = { ...req.body, owner: req.user.id };
    const project = await Project.create(payload);
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Get a list of all projects (public endpoint).
 * - Sorted by newest first.
 */
exports.listProjects = async (req, res) => {
  try {
    const items = await Project.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get one project by its ID (public endpoint).
 */
exports.getProject = async (req, res) => {
  try {
    const item = await Project.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Update a project.
 * - Only the project owner or an admin can update.
 */
exports.updateProject = async (req, res) => {
  try {
    const item = await Project.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });

    // Check if the user is authorized
    if (item.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    Object.assign(item, req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Delete a project.
 * - Only the project owner or an admin can delete.
 */
exports.deleteProject = async (req, res) => {
  try {
    const item = await Project.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });

    // Check if the user is authorized
    if (item.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await item.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
