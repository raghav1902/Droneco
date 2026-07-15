/**
 * @file auditLogger.js
 * @description Utility for recording audit logs to the database.
 */

const AuditLog = require('../models/auditlog.model');
const User = require('../models/user.model');

/**
 * Log an action to the AuditLog collection
 * @param {string} userId - User ID performing the action (can be null for system actions)
 * @param {string} action - Short action name (e.g., 'Login', 'Collect Fee')
 * @param {string} details - Detailed description of the action
 * @param {string} ipAddress - IP Address of the requester
 */
const logAudit = async (userId, action, details, ipAddress = 'Unknown') => {
  try {
    let userName = 'System / Unknown';
    
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        userName = user.name;
      }
    }

    const log = new AuditLog({
      user_id: userId || null,
      user_name: userName,
      action,
      details,
      ip_address: ipAddress
    });

    await log.save();
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
};

module.exports = {
  logAudit
};
