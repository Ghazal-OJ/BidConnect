const Project = require('../models/Project');

// create
exports.createProject = async (req, res) => {
  try {
    const payload = {
      title: req.body.title,
      description: req.body.description,
      budget: req.body.budget,
      owner: req.user.id,
    };
    const project = await Project.create(payload);
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// list (public)
exports.listProjects = async (_req, res) => {
  try {
    const items = await Project.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// get (public)
exports.getProject = async (req, res) => {
  try {
    const item = await Project.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// update (only owner)
exports.updateProject = async (req, res) => {
  try {
    const update = {
      title: req.body.title,
      description: req.body.description,
      budget: req.body.budget,
    };
    const item = await Project.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// delete (only owner)
exports.deleteProject = async (req, res) => {
  try {
    const item = await Project.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
