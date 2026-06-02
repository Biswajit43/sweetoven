const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  cake: { type: mongoose.Schema.Types.ObjectId, ref: 'Cake', required: true },
  cakeName: { type: String, required: true },
  weight: { type: String, default: '1 Kg' },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  deliveryDate: { type: Date, required: true },
  deliveryTime: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  orderNote: { type: String, default: '' },
  couponCode: { type: String, default: '' },
  discount: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ['UPI', 'COD', 'Pending'], default: 'Pending' },
  paymentStatus: { type: String, enum: ['Payment Pending', 'Payment Received', 'Refunded'], default: 'Payment Pending' },
  paymentScreenshot: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  }
}, { timestamps: true });

// Auto-generate order ID
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = `#SO${String(1250 + count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
