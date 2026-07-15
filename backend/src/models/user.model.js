const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false // Exclude from default query results
  },
  passwordChangedAt: Date,
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  phone: {
    type: String,
    trim: true
  },
  profile_photo: {
    type: String
  },
  is_deleted: {
    type: Boolean,
    default: false,
    index: true
  },
  deleted_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Pre-find hook to filter out soft-deleted documents
UserSchema.pre(/^find/, function (next) {
  if (this.getOptions().includeDeleted !== true) {
    this.where({ is_deleted: { $ne: true } });
  }
  next();
});

// Pre-save hook to hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000; // Subtract 1s to ensure token created after saving doesn't fail
  }
  
  next();
});

// Method to match entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if password was changed after the token was issued
UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    // ensure password is deleted even if manually queried without select: false
    delete ret.password;
  }
});

module.exports = mongoose.model('User', UserSchema);
