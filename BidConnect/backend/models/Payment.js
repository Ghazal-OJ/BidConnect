const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },   // employer
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },     // freelancer
  amount: { type: Number, required: true, min: 1 },
  note: { type: String, maxlength: 1000 },
  status: { type: String, enum: ['Recorded'], default: 'Recorded' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
