const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  project:     { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  bidder:      { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true }, // freelancer
  amount:      { type: Number, required: true, min: 1 },
  days:        { type: Number, min: 1 },
  coverLetter: { type: String, maxlength: 5000 },
  status:      { type: String, enum: ['Pending', 'Accepted', 'Declined', 'Withdrawn'], default: 'Pending' }
}, { timestamps: true });

// ❗️فقط وقتی status ∈ {Pending, Accepted} باشد «یکتا» باشد (یعنی بید فعال فقط یکی)
bidSchema.index(
  { project: 1, bidder: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ['Pending', 'Accepted'] } } }
);

module.exports = mongoose.model('Bid', bidSchema);
