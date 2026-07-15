/**
 * @file auditlog.controller.js
 * @description Controller for fetching audit logs for admin.
 */

const AuditLog = require('../models/auditlog.model');

// @desc    Get audit logs
// @route   GET /api/admin/audit-logs
// @access  Private (Admin only)
const getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const logs = await AuditLog.find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalLogs = await AuditLog.countDocuments();

    res.status(200).json({
      success: true,
      count: logs.length,
      pagination: {
        total: totalLogs,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalLogs / limitNum)
      },
      data: logs.map(log => ({
        id: log._id,
        time: log.created_at,
        user: log.user_name,
        action: log.action,
        details: log.details,
        ip: log.ip_address || 'Unknown'
      }))
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ success: false, message: 'Server error fetching audit logs' });
  }
};

module.exports = {
  getAuditLogs
};
