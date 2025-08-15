const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Subdocument for freelancer portfolio
const PortfolioSchema = new mongoose.Schema({
  bio:   { type: String, default: '' },
  skills: [{ type: String, trim: true }],
  links:  [{ label: String, url: String }],
}, { _id: false });

const UserSchema = new mongoose.Schema({
  // Basic info
  name:   { type: String, required: true, trim: true },
  email:  { type: String, required: true, unique: true, lowercase: true, trim: true },

  // Auth
  password: { type: String, required: true, minlength: 6 },

  // Role system: only employer | freelancer
  role: { type: String, enum: ['employer', 'freelancer'], required: true, default: 'freelancer' },

  // Freelancer-only portfolio (safe to keep for both; employers can ignore it)
  portfolio: { type: PortfolioSchema, default: () => ({}) },

  // Password reset (optional)
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

// Hash password before saving (only if changed)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare plain password with hashed password
UserSchema.methods.compare = function (pw) {
  return bcrypt.compare(pw, this.password);
};

// Hide sensitive fields when converting to JSON
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
