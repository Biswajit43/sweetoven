const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const { protect, adminOnly } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, 'payment_' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// User: Place order
router.post('/', protect, async (req, res) => {
  try {
    const { cakeId, cakeName, weight, quantity, price, deliveryDate, deliveryTime, deliveryAddress, orderNote, couponCode } = req.body;
    let totalAmount = price * (quantity || 1);
    let discount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon) {
        if (coupon.discountType === 'percentage') {
          discount = Math.round((totalAmount * coupon.discountValue) / 100);
          if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
        } else {
          discount = coupon.discountValue;
        }
        totalAmount -= discount;
        await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
      }
    }

    const order = await Order.create({
      user: req.user._id,
      customerName: req.user.name,
      phone: req.user.phone,
      cake: cakeId,
      cakeName,
      weight: weight || '1 Kg',
      quantity: quantity || 1,
      price,
      totalAmount,
      deliveryDate,
      deliveryTime,
      deliveryAddress,
      orderNote,
      couponCode,
      discount
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// User: Get my orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('cake').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// User: Upload payment screenshot
router.put('/:id/payment', protect, upload.single('screenshot'), async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const updates = { paymentMethod };
    if (req.file) updates.paymentScreenshot = `/uploads/${req.file.filename}`;
    if (paymentMethod === 'COD') updates.paymentStatus = 'Payment Pending';
    const order = await Order.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, updates, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get all orders
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const query = status && status !== 'All' ? { status } : {};
    const orders = await Order.find(query).populate('user', 'name email phone').populate('cake').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get single order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone').populate('cake');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Update order status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (paymentStatus) updates.paymentStatus = paymentStatus;
    const order = await Order.findByIdAndUpdate(req.params.id, updates, { new: true }).populate('user cake');
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Delete order
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
