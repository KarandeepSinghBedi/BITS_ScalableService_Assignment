const express = require('express');
const router = express.Router();
const { protect, isSuperAdmin, allowOnlyUsers } = require('../middleware/authMiddleware');
const { placeOrder, getUserOrders, getAllOrders } = require('../controllers/orderController');

router.post('/', protect, allowOnlyUsers, placeOrder);
router.get('/my', protect, getUserOrders);
router.get('/all', protect, isSuperAdmin, getAllOrders);

module.exports = router;
