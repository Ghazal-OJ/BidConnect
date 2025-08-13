// controllers/portfolioController.js
const User = require('../models/User');

// Return the logged-in freelancer's portfolio
exports.getMyPortfolio = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('role portfolio');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'freelancer') {
      return res.status(403).json({ message: 'Only freelancers can access portfolio' });
    }
    res.json(user.portfolio || {});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update the logged-in freelancer's portfolio
exports.updateMyPortfolio = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('role portfolio');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'freelancer') {
      return res.status(403).json({ message: 'Only freelancers can update portfolio' });
    }

    // Allow only safe fields
    const { bio, skills, links } = req.body;
    if (bio !== undefined) user.portfolio.bio = bio;
    if (Array.isArray(skills)) user.portfolio.skills = skills;
    if (Array.isArray(links)) user.portfolio.links = links;

    await user.save();
    res.json(user.portfolio);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
