// backend/controllers/bidController.js
const Bid = require('../models/Bid');
const Project = require('../models/Project');

// Submit bid (freelancer)
exports.submitBid = async (req, res) => {
  try {
    // دفاع دو لایه (علاوه بر requireRole در routes)
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ error: 'Only freelancers can bid' });
    }

    const { projectId } = req.params;
    const { amount, days, coverLetter } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // مالک پروژه نمی‌تواند روی پروژه‌ی خودش Bid بدهد
    if (project.owner.toString() === req.user.id) {
      return res.status(400).json({ error: 'Owner cannot bid on own project' });
    }

    // جلوگیری از ثبت چندباره‌ی بید توسط همان فریلنسر (اختیاری ولی مفید)
    const exists = await Bid.findOne({ project: projectId, bidder: req.user.id, status: { $in: ['Pending', 'Accepted', 'Declined'] } });
    if (exists) {
      return res.status(400).json({ error: 'You have already placed a bid for this project' });
    }

    // اعتبارسنجی اولیه
    const amt = Number(amount), d = Number(days);
    if (!amt || amt <= 0 || !d || d <= 0) {
      return res.status(400).json({ error: 'Invalid amount/days' });
    }

    const bid = await Bid.create({
      project: projectId,
      bidder: req.user.id,
      amount: amt,
      days: d,
      coverLetter
    });

    res.status(201).json(bid);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// List bids by project (owner sees all; freelancer sees only their own; others 403)
exports.listBidsForProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId).select('owner');
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // مالک پروژه: تمام بیدها
    if (project.owner.toString() === req.user.id) {
      const bids = await Bid.find({ project: projectId })
        .sort({ amount: 1 })
        .populate('bidder', 'name role');
      return res.json(bids);
    }

    // فریلنسر: فقط بیدهای خودش
    if (req.user.role === 'freelancer') {
      const bids = await Bid.find({ project: projectId, bidder: req.user.id })
        .sort({ amount: 1 })
        .populate('bidder', 'name role');
      return res.json(bids);
    }

    // سایرین: دسترسی ندارند
    return res.status(403).json({ error: 'Forbidden' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Edit / Withdraw bid (only bidder; only while Pending)
exports.updateBid = async (req, res) => {
  try {
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ error: 'Only freelancers can update bids' });
    }

    const bid = await Bid.findById(req.params.bidId);
    if (!bid) return res.status(404).json({ error: 'Bid not found' });
    if (bid.bidder.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    if (bid.status !== 'Pending') {
      return res.status(400).json({ error: 'Only pending bids can be updated' });
    }

    if (req.body.action === 'withdraw') {
      bid.status = 'Withdrawn';
    } else {
      const { amount, days, coverLetter } = req.body;
      if (amount !== undefined) {
        const a = Number(amount);
        if (!a || a <= 0) return res.status(400).json({ error: 'Invalid amount' });
        bid.amount = a;
      }
      if (days !== undefined) {
        const d = Number(days);
        if (!d || d <= 0) return res.status(400).json({ error: 'Invalid days' });
        bid.days = d;
      }
      if (coverLetter !== undefined) bid.coverLetter = coverLetter;
    }

    await bid.save();
    res.json(bid);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Accept bid (only employer who owns the project)
exports.acceptBid = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can accept bids' });
    }

    const bid = await Bid.findById(req.params.bidId).populate('project');
    if (!bid) return res.status(404).json({ error: 'Bid not found' });

    const project = bid.project;
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // فقط مالک پروژه
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // اگر قبلاً Award شده، جلوگیری کن
    if (project.status === 'Awarded') {
      return res.status(400).json({ error: 'Project already awarded' });
    }
    if (bid.status !== 'Pending') {
      return res.status(400).json({ error: 'Only pending bids can be accepted' });
    }

    // پذیرش بید انتخابی
    bid.status = 'Accepted';
    await bid.save();

    // رد کردن بقیه‌ی بیدهای درحال انتظار
    await Bid.updateMany(
      { project: project._id, _id: { $ne: bid._id }, status: 'Pending' },
      { $set: { status: 'Declined' } }
    );

    // به‌روزرسانی پروژه
    project.status = 'Awarded';
    project.awardedBid = bid._id;
    await project.save();

    res.json({ ok: true, bid, project });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
