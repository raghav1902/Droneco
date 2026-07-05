const express = require('express');
const router = express.Router();
const { createFee, getDueFees, getFeesByStudent } = require('../controllers/Fee/feeController');
const { protect } = require('../middleware/authentication/authMiddleware');
const { authorize } = require('../middleware/authorization/roleMiddleware');

router.post('/', protect, authorize('admin', 'receptionist'), createFee);
router.get('/dues', protect, authorize('admin', 'receptionist'), getDueFees);
router.get('/student/:leadId', protect, authorize('admin', 'receptionist'), getFeesByStudent);

module.exports = router;
