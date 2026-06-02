const express = require('express');
const router = express.Router();
const Cake = require('../models/Cake');
const { protect, adminOnly } = require('../middleware/auth');
const { upload, cloudinary } = require('../middleware/cloudinary');

// Get all cakes (public)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = { isAvailable: true };
    if (category && category !== 'All') query.category = category;
    const cakes = await Cake.find(query).sort({ isBestSeller: -1, createdAt: -1 });
    res.json(cakes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single cake
router.get('/:id', async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);
    if (!cake) return res.status(404).json({ message: 'Cake not found' });
    res.json(cake);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Create cake
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, category, weight, price, description, isBestSeller, customizable } = req.body;
    let imageUrl = req.body.image;

    if (req.file) {
      // Upload to Cloudinary
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'sweetoven/cakes',
        resource_type: 'auto'
      });
      imageUrl = result.secure_url;
    }

    const cake = await Cake.create({
      name, category, weight, price, description, image: imageUrl,
      isBestSeller: isBestSeller === 'true',
      customizable: customizable === 'true'
    });
    res.status(201).json(cake);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Update cake
router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const updates = { ...req.body };

    if (req.file) {
      // Upload to Cloudinary
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'sweetoven/cakes',
        resource_type: 'auto'
      });
      updates.image = result.secure_url;
    }

    if (updates.isBestSeller) updates.isBestSeller = updates.isBestSeller === 'true';
    const cake = await Cake.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(cake);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Delete cake
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Cake.findByIdAndDelete(req.params.id);
    res.json({ message: 'Cake deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
