const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // freelancer
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, maxlength: 5000 },
  skills: [{ type: String, trim: true }],
  links: [{ type: String, trim: true }],
  images: [{ type: String }], // مسیر عکس‌ها یا URL
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
