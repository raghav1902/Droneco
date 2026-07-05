const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  // --- Step 1: Basic Info (Combined) ---
  filler_type: {
    type: String,
    default: 'student',
    enum: ['student', 'guardian']
  },
  guardian_name: { type: String },
  guardian_relation: { type: String },
  guardian_phone: { type: String },
  full_name: { type: String, required: true },
  email: { type: String, required: true },
  mobile_number: { type: String, required: true },
  city: { type: String, required: true },

  // --- Step 2: Course Info (Combined) ---
  qualification: { type: String },
  currentClass: { type: String },
  interested_course_id: { type: String },
  interestedCourse: { type: String },
  interestedSubject: { type: String },
  preferredBatch: { type: String },
  learningMode: {
    type: String,
    enum: ['online', 'offline', 'hybrid']
  },

  // --- Step 3: Additional Info (Combined) ---
  queries: { type: String },
  careerGoal: { type: String },
  remarks: { type: String },

  // --- Dynamic Responses (From Controller) ---
  responses: [{
    question_id: String,
    response_value: mongoose.Schema.Types.Mixed
  }],

  // --- Initial Feedback (From Controller) ---
  feedback: {
    rating: { type: Number, default: 5 },
    source: { type: String, default: 'Direct' },
    comments: { type: String, default: '' }
  },

  // --- Metadata (Combined) ---
  status: {
    type: String,
    default: 'New',
    enum: ['New', 'Contacted', 'Interested', 'Not Interested', 'Enrolled']
  },
  assigned_to_staff_id: { type: String, default: null },

  submitted_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Indexes for fast querying
LeadSchema.index({ email: 1 });
LeadSchema.index({ mobile_number: 1 });
LeadSchema.index({ status: 1 });

LeadSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('Lead', LeadSchema);
