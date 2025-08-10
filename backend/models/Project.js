const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // employer
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, maxlength: 5000 },
  budgetMin: { type: Number, min: 0 },
  budgetMax: { type: Number, min: 0 },
  skills: [{ type: String, trim: true }],
  deadline: { type: Date },
  status: { type: String, enum: ['Draft', 'Published', 'Awarded', 'Closed'], default: 'Published' },
  awardedBid: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
