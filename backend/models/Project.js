const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  // Who owns the project (the employer)
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Main details
  title:       { type: String, required: true, trim: true, maxlength: 120 }, // Short title
  description: { type: String, required: true, maxlength: 5000 },            // Full description
  category:    { type: String, trim: true },                                 // Optional category

  // Budget range
  budgetMin:   { type: Number, min: 0 },
  budgetMax:   { type: Number, min: 0 },

  // Skills needed
  skills:      [{ type: String, trim: true }],

  // Project deadline
  deadline:    { type: Date },

  // Files & images
  attachments: [{ url: String, name: String }], // PDFs or non-image files
  images:      [{ url: String, name: String }], // Project image gallery
  // If only one cover image is needed:
  // imageUrl:  { type: String },

  // Who can see this project
  visibility:  { type: String, enum: ['public', 'invite-only'], default: 'public' },

  // Current status
  status:      { type: String, enum: ['Draft', 'Published', 'Awarded', 'Closed'], default: 'Published' },

  // The winning bid (if selected)
  awardedBid:  { type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }

}, { timestamps: true }); // Auto adds createdAt & updatedAt

// Validate budget logic before saving
ProjectSchema.pre('validate', function (next) {
  if (this.budgetMin != null && this.budgetMax != null && this.budgetMax < this.budgetMin) {
    return next(new Error('budgetMax cannot be less than budgetMin'));
  }
  next();
});

// Optional: text index for search
// ProjectSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Project', ProjectSchema);
