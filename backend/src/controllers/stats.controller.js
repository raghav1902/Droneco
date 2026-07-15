/**
 * @file statsController.js
 * @description Controller for admin dashboard analytics and statistics.
 */

const Lead = require('../models/lead.model');
const Course = require('../models/course.model');

// @desc    Get lead analytics for admin dashboard
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments({ is_deleted: { $ne: true } });
    const enrolledLeads = await Lead.countDocuments({ status: 'Enrolled', is_deleted: { $ne: true } });
    const pendingFollowUps = await Lead.countDocuments({ status: { $in: ['New', 'Contacted'] }, is_deleted: { $ne: true } });

    const conversionRate = totalLeads > 0 ? ((enrolledLeads / totalLeads) * 100).toFixed(1) : 0;

    // Aggregate leads by status
    const leadsByStatusAgg = await Lead.aggregate([
      { $match: { is_deleted: { $ne: true } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Ensure all statuses are present
    const defaultStatuses = ['New', 'Contacted', 'Interested', 'Not Interested', 'Enrolled'];
    const statusMap = {};
    defaultStatuses.forEach(s => statusMap[s] = 0);
    leadsByStatusAgg.forEach(item => {
      statusMap[item._id] = item.count;
    });
    const leadsByStatus = Object.keys(statusMap).map(key => ({ name: key, value: statusMap[key] }));

    // Aggregate leads by course using database-level lookup instead of in-memory maps
    const leadsByCourseAgg = await Lead.aggregate([
      { $match: { is_deleted: { $ne: true } } },
      {
        $lookup: {
          from: 'courses',
          localField: 'interested_course_id',
          foreignField: '_id',
          as: 'courseDetails'
        }
      },
      {
        $unwind: {
          path: '$courseDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$courseDetails.course_name',
          count: { $sum: 1 }
        }
      }
    ]);

    const leadsByCourse = leadsByCourseAgg.map(item => ({
      name: item._id || 'Unknown / Deleted',
      value: item.count
    }));

    // Get recent leads
    const recentLeadsRaw = await Lead.find({ is_deleted: { $ne: true } })
      .sort({ submitted_at: -1 })
      .limit(5)
      .populate('interested_course_id', 'course_name');

    const recentLeads = recentLeadsRaw.map(lead => ({
      id: lead._id,
      full_name: lead.full_name,
      email: lead.email,
      mobile_number: lead.mobile_number,
      status: lead.status,
      course_name: lead.interested_course_id ? lead.interested_course_id.course_name : 'N/A',
      submitted_at: lead.submitted_at
    }));

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalLeads,
          enrolledLeads,
          conversionRate: Number(conversionRate),
          pendingFollowUps
        },
        leadsByStatus,
        leadsByCourse,
        recentLeads
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ success: false, message: 'Server error fetching statistics' });
  }
};

module.exports = {
  getStats
};
