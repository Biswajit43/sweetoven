const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS Configuration - Allow frontend URL
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  process.env.FRONTEND_URL || '',
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cakes', require('./routes/cakes'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/reviews', require('./routes/reviews'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('MongoDB Connected');
    // Seed admin if not exists
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
      await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@sweetoven.com',
        password: hashed,
        phone: '9999999999',
        role: 'admin'
      });
      console.log('Admin user seeded');
    }
    // Seed sample cakes
    const Cake = require('./models/Cake');
    const cakeCount = await Cake.countDocuments();
    if (cakeCount === 0) {
      await Cake.insertMany([
        { name: 'Chocolate Truffle', category: 'Birthday', weight: '1 Kg', price: 899, description: 'Rich chocolate truffle cake with layers of ganache', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', isBestSeller: true },
        { name: 'Red Velvet Cake', category: 'Anniversary', weight: '1 Kg', price: 999, description: 'Classic red velvet with cream cheese frosting', image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400' },
        { name: 'Butterscotch Cake', category: 'Birthday', weight: '1 Kg', price: 899, description: 'Buttery butterscotch with caramel drizzle', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400' },
        { name: 'Black Forest Cake', category: 'Chocolate', weight: '1 Kg', price: 899, description: 'German chocolate cake with cherries and cream', image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400' },
        { name: 'Photo Cake', category: 'Photo Cake', weight: '1 Kg', price: 1199, description: 'Custom photo printed on premium cake', image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400' },
        { name: 'Strawberry Delight', category: 'Custom', weight: '1 Kg', price: 1099, description: 'Fresh strawberry cake with whipped cream', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400' }
      ]);
      console.log('Sample cakes seeded');
    }
  })
  .catch(err => console.error('MongoDB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
