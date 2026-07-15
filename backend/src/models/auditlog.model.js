/**
 * @file auditlog.model.js
 * @description Mongoose schema for system audit logs.
 */

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  user_name: {
    type: String,
    required: false,
    default: 'System / Unknown'
  },
  action: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  ip_address: {
    type: String,
    required: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
