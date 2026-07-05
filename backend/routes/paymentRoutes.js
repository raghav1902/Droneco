const express = require('express');
const router = express.Router();
const { createPayment, getPayments } = require('../controllers/Payment/paymentController');
const { protect } = require('../middleware/authentication/authMiddleware');
const { authorize } = require('../middleware/authorization/roleMiddleware');

router.post('/', protect, authorize('admin', 'receptionist'), createPayment);
router.get('/', protect, authorize('admin', 'receptionist'), getPayments);

module.exports = router;
