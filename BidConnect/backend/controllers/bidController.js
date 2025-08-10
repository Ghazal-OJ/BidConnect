const Bid = require('../models/Bid');
const Project = require('../models/Project');

// Submit bid (freelancer)
exports.submitBid = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { amount, days, coverLetter } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (project.owner.toString() === req.user.id) {
      return res.status(400).json({ error: 'Owner cannot bid on own project' });
    }

    const bid = await Bid.create({
      project: projectId,
      bidder: req.user.id,
      amount,
      days,
      coverLetter
    });
    res.status(201).json(bid);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

// List bids by project (employer or logged-in user)
exports.listBidsForProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const bids = await Bid.find({ project: projectId })
      .sort({ amount: 1 })
      .populate('bidder', 'name role');
    res.json(bids);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

// Edit/Withdraw bid (owner of bid)
exports.updateBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId);
    if (!bid) return res.status(404).json({ error: 'Bid not found' });
    if (bid.bidder.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    if (req.body.action === 'withdraw') {
      bid.status = 'Withdrawn';
    } else {
      const { amount, days, coverLetter } = req.body;
      if (amount !== undefined) bid.amount = amount;
      if (days !== undefined) bid.days = days;
      if (coverLetter !== undefined) bid.coverLetter = coverLetter;
    }
    await bid.save();
    res.json(bid);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

// Accept bid (employer)
exports.acceptBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId).populate('project');
    if (!bid) return res.status(404).json({ error: 'Bid not found' });

    const project = bid.project;
    if (project.owner.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Forbidden' });

    bid.status = 'Accepted';
    await bid.save();

    await Bid.updateMany(
      { project: project._id, _id: { $ne: bid._id }, status: { $in: ['Pending'] } },
      { $set: { status: 'Declined' } }
    );

    project.status = 'Awarded';
    project.awardedBid = bid._id;
    await project.save();

    res.json({ ok: true, bid, project });
  } catch (err) { res.status(400).json({ error: err.message }); }
};
