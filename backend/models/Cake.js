const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['Birthday', 'Anniversary', 'Chocolate', 'Photo Cake', 'Custom', 'All'] },
  weight: { type: String, default: '1 Kg' },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  isBestSeller: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  customizable: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Cake', cakeSchema);
