const Portfolio = require('../models/Portfolio');

// ایجاد آیتم پورتفولیو
exports.createPortfolio = async (req, res) => {
  try {
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ error: 'Only freelancers can create portfolio' });
    }
    const portfolio = await Portfolio.create({ ...req.body, owner: req.user.id });
    res.status(201).json(portfolio);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// لیست پورتفولیوهای یک کاربر
exports.getMyPortfolio = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ owner: req.user.id });
    res.json(portfolios);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// بروزرسانی پورتفولیو
exports.updatePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });
    if (portfolio.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    Object.assign(portfolio, req.body);
    await portfolio.save();
    res.json(portfolio);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// حذف پورتفولیو
exports.deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });
    if (portfolio.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await portfolio.deleteOne();
    res.json({ message: 'Portfolio deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
