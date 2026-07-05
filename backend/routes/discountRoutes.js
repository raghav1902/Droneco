const express = require('express');
const router = express.Router();
const { getDiscounts, createDiscount, updateDiscount, deleteDiscount } = require('../controllers/Admin/discountController');
const { protect } = require('../middleware/authentication/authMiddleware');
const { authorize } = require('../middleware/authorization/roleMiddleware');

// Protect all routes and restrict to admin
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getDiscounts)
  .post(createDiscount);

router.route('/:id')
  .put(updateDiscount)
  .delete(deleteDiscount);

module.exports = router;
