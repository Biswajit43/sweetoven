const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Cake = require('../models/Cake');
const { protect, adminOnly } = require('../middleware/auth');

// Admin: Dashboard stats
router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const confirmedOrders = await Order.countDocuments({ status: 'Confirmed' });
    const preparingOrders = await Order.countDocuments({ status: 'Preparing' });
    const outForDeliveryOrders = await Order.countDocuments({ status: 'Out for Delivery' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalCakes = await Cake.countDocuments();
    const revenueData = await Order.aggregate([
      { $match: { status: 'Delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData[0]?.total || 0;
    const recentOrders = await Order.find().populate('user', 'name').populate('cake', 'name').sort({ createdAt: -1 }).limit(5);
    res.json({
      totalOrders, pendingOrders, confirmedOrders, preparingOrders,
      outForDeliveryOrders, deliveredOrders, totalUsers, totalCakes, totalRevenue, recentOrders
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get all customers
router.get('/customers', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
