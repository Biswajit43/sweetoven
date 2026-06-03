# 🎂 SweetOven - MERN Stack Cake Shop

> Happiness Delivered with Love — Full-stack cake ordering platform with User Panel + Admin Dashboard

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| Styling | Pure CSS with Google Fonts |
| File Upload | Multer |

---

## 📁 Project Structure

```
sweetoven/
├── backend/
│   ├── models/         # Mongoose models (User, Cake, Order, Coupon, Review)
│   ├── routes/         # Express routes (auth, cakes, orders, admin, coupons, reviews)
│   ├── middleware/      # JWT auth middleware
│   ├── uploads/        # Uploaded images (auto-created)
│   └── server.js       # Entry point
│
├── frontend/
│   └── src/
│       ├── components/  # Navbar
│       ├── context/     # AuthContext (JWT state)
│       ├── pages/
│       │   ├── user/    # Home, Cakes, CakeDetail, OrderForm, MyOrders, Payment, Login, Register, Profile
│       │   └── admin/   # AdminLayout, Dashboard, Orders, Cakes, Customers, Coupons, Reviews
│       └── index.css    # Global design system
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 16+
- MongoDB (local or MongoDB Atlas)

### 1. Clone & Install

```bash
# Install all dependencies
cd sweetoven
npm run install-all
```

### 2. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/sweetoven
JWT_SECRET=your_secret_key_here
ADMIN_EMAIL=ADMIN_EMAIL
ADMIN_PASSWORD=ADMIN_PASSWORD
```

For MongoDB Atlas:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sweetoven
```

### 3. Create uploads folder

```bash
mkdir backend/uploads
```

### 4. Run Development Servers

```bash
# Run both frontend and backend together
npm run dev

# OR run separately:
npm run dev-backend   # Backend on :5000
npm run dev-frontend  # Frontend on :3000
```

### 5. Open in Browser

- **User Site:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin

---

## 🔑 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@sweetoven.com | admin123 |
| **User** | Register via /register | Any password |

> Admin user is auto-seeded on first server start. Sample cakes are also seeded automatically.

---

## ✨ Features

### 👤 User Panel
- 🏠 **Home** — Hero section, popular cakes, how it works, custom cake CTA
- 🎂 **Cakes** — Browse with category filter (Birthday, Anniversary, Chocolate, Photo Cake, Custom) + search
- 📋 **Cake Detail** — Full details + customer reviews
- 📝 **Order Form** — Select quantity, delivery date/time/address, apply coupon code
- 💳 **Payment** — UPI (with screenshot upload) or Cash on Delivery
- 📦 **My Orders** — Track all orders with visual status timeline
- 👤 **Profile** — Update name, phone, address

### 👑 Admin Panel
- 📊 **Dashboard** — Live stats: total orders, revenue, pending/confirmed/preparing/out for delivery/delivered counts, recent orders table
- 📦 **Orders** — View all orders with status filter tabs, inline status update dropdown, order detail side panel, approve & send payment, mark payment received
- 🎂 **Cakes** — Add/Edit/Delete cakes with image URL, category, price, weight, best seller toggle
- 👥 **Customers** — View all registered users, order counts per customer
- 🏷️ **Coupons** — Create percentage/fixed coupons, set expiry/usage limits, activate/deactivate
- ⭐ **Reviews** — Approve/reject/delete customer reviews before they go public

---

## 🔌 API Reference

### Auth
| Method | Route | Access |
|--------|-------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/profile | User |
| PUT | /api/auth/profile | User |

### Cakes
| Method | Route | Access |
|--------|-------|--------|
| GET | /api/cakes | Public |
| GET | /api/cakes/:id | Public |
| POST | /api/cakes | Admin |
| PUT | /api/cakes/:id | Admin |
| DELETE | /api/cakes/:id | Admin |

### Orders
| Method | Route | Access |
|--------|-------|--------|
| POST | /api/orders | User |
| GET | /api/orders/my | User |
| PUT | /api/orders/:id/payment | User |
| GET | /api/orders | Admin |
| PUT | /api/orders/:id/status | Admin |
| DELETE | /api/orders/:id | Admin |

### Admin
| Method | Route | Access |
|--------|-------|--------|
| GET | /api/admin/dashboard | Admin |
| GET | /api/admin/customers | Admin |

### Coupons
| Method | Route | Access |
|--------|-------|--------|
| POST | /api/coupons/validate | User |
| GET | /api/coupons | Admin |
| POST | /api/coupons | Admin |
| PUT | /api/coupons/:id | Admin |
| DELETE | /api/coupons/:id | Admin |

### Reviews
| Method | Route | Access |
|--------|-------|--------|
| GET | /api/reviews/cake/:cakeId | Public |
| POST | /api/reviews | User |
| GET | /api/reviews | Admin |
| PUT | /api/reviews/:id | Admin |
| DELETE | /api/reviews/:id | Admin |

---

## 🎨 Order Flow

```
User browses cakes → Places order → Admin gets notified
  → Admin approves (Confirmed) → User pays (UPI/COD)
    → Admin marks payment received → Status: Preparing
      → Out for Delivery → Delivered ✅
```

---

## 🌐 Deploying to Production

### ⚡ Quick Start (Read First!)
📖 **See QUICK_DEPLOY.md** for step-by-step deployment in 15 minutes

### Architecture
```
Frontend (React)          Backend (Node.js)        Database
   ↓                           ↓                       ↓
 VERCEL                      RENDER                MONGODB ATLAS
 (Auto-deploy)            (Free tier)              (Already set up)
```

### Deployment Steps

#### 1. **Push to GitHub**
```bash
git init
git add .
git commit -m "SweetOven ready for deployment"
git push origin main
```

#### 2. **Deploy Backend (Render)**
- Go to https://render.com
- Sign up with GitHub
- Create "Web Service"
- Select sweetoven repo
- **Root Directory**: backend
- **Build**: `npm install`
- **Start**: `npm start`
- **Environment Variables**:
```
PORT=10000
MONGO_URI=mongodb+srv://bsbiswajit2005_db_user:zZoVekBSz4yVgSbq@homedelivery.fnjyhzf.mongodb.net/?appName=homedelivery
JWT_SECRET=sweetoven_super_secret_jwt_key_2024
ADMIN_EMAIL=admin@sweetoven.com
ADMIN_PASSWORD=admin123
CLOUDINARY_CLOUD_NAME=dla1ri110
CLOUDINARY_API_KEY=316972792766635
CLOUDINARY_API_SECRET=1Ridh6zTYwgIKNMqhZ6amPqC6xc
FRONTEND_URL=https://your-vercel-url.vercel.app
```
- Copy your backend URL (e.g., https://sweetoven-backend-xxxxx.onrender.com)

#### 3. **Deploy Frontend (Vercel)**
- Go to https://vercel.com
- Sign up with GitHub
- Create new project
- **Framework**: React
- **Root Directory**: frontend
- **Build**: `npm run build`
- **Environment Variable**:
```
REACT_APP_API_URL=https://sweetoven-backend-xxxxx.onrender.com
```
- Deploy! Frontend will auto-deploy on future git pushes

#### 4. **Verify Deployment**
```bash
# Test backend
curl https://sweetoven-backend-xxxxx.onrender.com/api/cakes

# Visit frontend
https://your-app.vercel.app
```

### 📚 Full Documentation
- **QUICK_DEPLOY.md** — 15-minute deployment guide
- **DEPLOYMENT_GUIDE.md** — Detailed instructions
- **CLOUDINARY_SETUP.md** — Image upload setup

---

## 📱 Design Highlights
- Pink & Brown brand palette (#E91E7A, #3D1C02)
- Playfair Display + DM Sans font pairing
- Mobile-responsive layouts
- Smooth hover animations
- Status badge system for order tracking

---

Made with ❤️ for SweetOven 🎂
