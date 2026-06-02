# SweetOven - Deployment Guide (Vercel + Render)

## 🚀 Deployment Architecture

```
Frontend (React)
  ↓ Deployed on → VERCEL (vercel.com)
  ↓ Calls API
  
Backend (Node.js + Express)
  ↓ Deployed on → RENDER (render.com)
  ↓ Uses Database
  
Database (MongoDB)
  ↓ Already Deployed on → MONGODB ATLAS (mongoDB Atlas)
  
Images
  ↓ Stored on → CLOUDINARY (via your credentials)
```

---

## 📋 Prerequisites

Before deploying, you need:

1. **GitHub Account** - For version control
2. **Vercel Account** - For frontend (free)
3. **Render Account** - For backend (free)
4. **MongoDB Atlas** - Already configured ✅
5. **Cloudinary** - Already configured ✅

---

## STEP 1️⃣: Prepare Your Code for Deployment

### 1.1 Create Environment Variables File for Backend

Create `backend/.env.production`:
```env
PORT=10000
MONGO_URI=mongodb+srv://bsbiswajit2005_db_user:zZoVekBSz4yVgSbq@homedelivery.fnjyhzf.mongodb.net/?appName=homedelivery
JWT_SECRET=sweetoven_super_secret_jwt_key_2024
ADMIN_EMAIL=admin@sweetoven.com
ADMIN_PASSWORD=admin123
CLOUDINARY_CLOUD_NAME=dla1ri110
CLOUDINARY_API_KEY=316972792766635
CLOUDINARY_API_SECRET=1Ridh6zTYwgIKNMqhZ6amPqC6xc
```

### 1.2 Update Frontend API URL

Update `frontend/.env.production`:
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

(You'll get the actual URL after deploying backend)

### 1.3 Update Backend CORS for Frontend

Edit `backend/server.js` - Update CORS:
```javascript
const cors = require('cors');
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-url.vercel.app'
  ],
  credentials: true
}));
```

### 1.4 Create Render Configuration

Create `backend/render.yaml`:
```yaml
services:
  - type: web
    name: sweetoven-backend
    env: node
    plan: free
    startCommand: npm start
    envVars:
      - key: PORT
        value: 10000
      - key: MONGO_URI
        value: mongodb+srv://bsbiswajit2005_db_user:zZoVekBSz4yVgSbq@homedelivery.fnjyhzf.mongodb.net/?appName=homedelivery
      - key: JWT_SECRET
        value: sweetoven_super_secret_jwt_key_2024
      - key: ADMIN_EMAIL
        value: admin@sweetoven.com
      - key: ADMIN_PASSWORD
        value: admin123
      - key: CLOUDINARY_CLOUD_NAME
        value: dla1ri110
      - key: CLOUDINARY_API_KEY
        value: 316972792766635
      - key: CLOUDINARY_API_SECRET
        value: 1Ridh6zTYwgIKNMqhZ6amPqC6xc
```

---

## STEP 2️⃣: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - SweetOven MERN project with Cloudinary"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sweetoven.git
git push -u origin main
```

---

## STEP 3️⃣: Deploy Backend on Render

### 3.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"

### 3.2 Configure Backend Service

1. **Connect GitHub** - Select your sweetoven repo
2. **Name**: `sweetoven-backend`
3. **Environment**: `Node`
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. **Plan**: Free

### 3.3 Add Environment Variables

In Render Dashboard:
1. Go to "Environment"
2. Add all variables from `.env`:
   - PORT: 10000
   - MONGO_URI: (your MongoDB connection)
   - JWT_SECRET: sweetoven_super_secret_jwt_key_2024
   - ADMIN_EMAIL: admin@sweetoven.com
   - ADMIN_PASSWORD: admin123
   - CLOUDINARY_CLOUD_NAME: dla1ri110
   - CLOUDINARY_API_KEY: 316972792766635
   - CLOUDINARY_API_SECRET: 1Ridh6zTYwgIKNMqhZ6amPqC6xc

### 3.4 Deploy
1. Click "Deploy"
2. Wait 3-5 minutes
3. Copy the URL (e.g., `https://sweetoven-backend.onrender.com`)

---

## STEP 4️⃣: Deploy Frontend on Vercel

### 4.1 Update Frontend Environment

Update `frontend/.env.production`:
```env
REACT_APP_API_URL=https://sweetoven-backend.onrender.com
```

### 4.2 Deploy on Vercel

**Option A: Using Vercel CLI (Recommended)**
```bash
cd frontend
npm install -g vercel
vercel --prod
```

**Option B: Using Vercel Dashboard**
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Select `sweetoven` repo
5. **Root Directory**: `frontend`
6. **Build Command**: `npm run build`
7. **Output Directory**: `build`
8. Add Environment Variable:
   - REACT_APP_API_URL: https://sweetoven-backend.onrender.com
9. Click "Deploy"

### 4.3 Your Frontend URL
After deployment: `https://your-project.vercel.app`

---

## STEP 5️⃣: Update Backend CORS

After getting Vercel frontend URL:

1. Go back to Render Backend Dashboard
2. Edit "Environment Variables"
3. Update the CORS configuration in code OR add to Render
4. Redeploy backend if needed

---

## 🧪 Testing After Deployment

### Test Backend
```bash
curl https://sweetoven-backend.onrender.com/api/cakes
```

Should return JSON array of cakes ✅

### Test Frontend
1. Go to your Vercel frontend URL
2. Click on "Cakes" page
3. Should load cakes from deployed backend ✅
4. Try admin login: admin@sweetoven.com / admin123
5. Try uploading a cake image ✅

---

## 📝 Full Deployment Checklist

- [ ] GitHub repo created and code pushed
- [ ] Backend deployed on Render
  - [ ] Environment variables set
  - [ ] Server running (check logs)
- [ ] Frontend deployed on Vercel
  - [ ] Build successful
  - [ ] API URL configured
- [ ] Test cakes loading
- [ ] Test user login
- [ ] Test admin panel
- [ ] Test image upload to Cloudinary
- [ ] Test creating new cake

---

## 🔗 Useful Links

- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Cloudinary Dashboard**: https://cloudinary.com/console

---

## ⚠️ Important Notes

### Free Tier Limitations

**Render (Backend)**
- Auto-sleeps after 15 min of inactivity
- First request takes 30 seconds to wake up
- Solution: Use paid tier (~$7/month) or Heroku alternative

**Vercel (Frontend)**
- Unlimited free deployments
- Fast, no cold starts ✅

**MongoDB Atlas**
- Free tier limited to 512MB storage
- Sufficient for development/testing

---

## 🔐 Security Best Practices

1. **Never commit .env files** - Add to `.gitignore` ✅
2. **Use strong JWT_SECRET** - Already done ✅
3. **Cloudinary API secured** - In backend only ✅
4. **CORS properly configured** - Set in backend ✅
5. **HTTPS only** - Both Vercel and Render use HTTPS ✅

---

## 💡 Deployment Comparison

| Feature | Vercel | Render |
|---------|--------|--------|
| Node.js Backend | ❌ | ✅ |
| React Frontend | ✅ | ❌ |
| Free Tier | ✅ | ✅ (with sleep) |
| Cold Starts | None | 30s (free tier) |
| Best For | Frontend | Backend |

---

## 🚀 Next Steps

1. **Create GitHub account** if you don't have one
2. **Push your code to GitHub**
3. **Deploy backend on Render**
4. **Deploy frontend on Vercel**
5. **Test all features**
6. **Monitor logs for errors**

---

## 📞 Support

If you face issues:
- Check backend logs on Render
- Check frontend logs on Vercel
- Check browser console for errors
- Verify environment variables
- Test API with Postman/curl

**Good luck with deployment! 🎉**
