const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect, adminOnly } = require('../middleware/auth');

// Get approved reviews for a cake
router.get('/cake/:cakeId', async (req, res) => {
  try {
    const reviews = await Review.find({ cake: req.params.cakeId, isApproved: true }).populate('user', 'name').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// User: Submit review
router.post('/', protect, async (req, res) => {
  try {
    const { cakeId, orderId, rating, comment } = req.body;
    const review = await Review.create({ user: req.user._id, cake: cakeId, order: orderId, rating, comment });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get all reviews
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const reviews = await Review.find().populate('user', 'name email').populate('cake', 'name').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Approve/reject review
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: req.body.isApproved }, { new: true });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Delete review
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
