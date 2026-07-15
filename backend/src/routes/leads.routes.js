/**
 * @file leads.js
 * @description Routes for managing student inquiries.
 */

const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  createLead,
  getLeads,
  updateLeadStatus,
  addLeadFeedback,
  getLeadFeedbackHistory,
  updateLead,
  deleteLead
} = require('../controllers/lead.controller');
const { protect } = require('../middleware/authentication/authMiddleware');
const { authorize } = require('../middleware/authorization/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createLeadSchema, updateLeadSchema, updateLeadStatusSchema, addFeedbackSchema } = require('../validators/schemas');

// Strict rate limiting for the public form to prevent bot spam
const publicFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // Limit each IP to 5 submissions per windowMs
  message: { success: false, message: 'Too many inquiries submitted from this IP, please try again after an hour.' }
});

// Public route for submitting inquiries (from QR multi-step form)
router.post('/', publicFormLimiter, validate(createLeadSchema), createLead);

// Protected routes for staff
router.get('/', protect, authorize('Admin', 'Receptionist'), getLeads);
router.put('/:id', protect, authorize('Admin', 'Receptionist'), validate(updateLeadSchema), updateLead);
router.patch('/:id/status', protect, authorize('Admin', 'Receptionist'), validate(updateLeadStatusSchema), updateLeadStatus);
router.post('/:id/feedback', protect, authorize('Admin', 'Receptionist'), validate(addFeedbackSchema), addLeadFeedback);
router.get('/:id/feedback', protect, authorize('Admin', 'Receptionist'), getLeadFeedbackHistory);
router.delete('/:id', protect, authorize('Admin'), deleteLead);

module.exports = router;
