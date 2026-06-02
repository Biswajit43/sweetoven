# SweetOven - Quick Deployment Steps

## 🚀 Deploy in 10 Minutes

### Step 1: Prepare GitHub
```bash
# From your project root
git init
git add .
git commit -m "SweetOven MERN - Ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sweetoven.git
git push -u origin main
```

### Step 2: Deploy Backend (Render - 3 minutes)

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select your sweetoven repo
5. **Name**: sweetoven-backend
6. **Root Directory**: backend
7. **Environment**: Node
8. **Build**: `npm install`
9. **Start**: `npm start`
10. **Plan**: Free

Add Environment Variables:
```
PORT=10000
MONGO_URI=mongodb+srv://bsbiswajit2005_db_user:zZoVekBSz4yVgSbq@homedelivery.fnjyhzf.mongodb.net/?appName=homedelivery
JWT_SECRET=sweetoven_super_secret_jwt_key_2024
ADMIN_EMAIL=admin@sweetoven.com
ADMIN_PASSWORD=admin123
CLOUDINARY_CLOUD_NAME=dla1ri110
CLOUDINARY_API_KEY=316972792766635
CLOUDINARY_API_SECRET=1Ridh6zTYwgIKNMqhZ6amPqC6xc
FRONTEND_URL=https://YOUR-VERCEL-URL.vercel.app
```

11. Click "Deploy" ✅ (Wait 3-5 min)
12. **Copy Backend URL**: https://sweetoven-backend-xxxxx.onrender.com

### Step 3: Deploy Frontend (Vercel - 5 minutes)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New Project"
4. Select sweetoven repo
5. **Framework**: React
6. **Root Directory**: frontend
7. **Build Command**: `npm run build`
8. **Output Dir**: `build`

Add Environment Variable:
```
REACT_APP_API_URL=https://sweetoven-backend-xxxxx.onrender.com
```

9. Click "Deploy" ✅ (Wait 2-3 min)
10. **Copy Frontend URL**: https://YOUR-APP.vercel.app

### Step 4: Update Backend CORS (2 minutes)

1. Go back to Render Backend Dashboard
2. Go to "Environment" section
3. Update variable:
   ```
   FRONTEND_URL=https://YOUR-APP.vercel.app
   ```
4. Click "Save" - Backend auto-redeploys ✅

---

## ✅ Verify Deployment

**Test Backend API:**
```bash
curl https://sweetoven-backend-xxxxx.onrender.com/api/health
```
Should return: `{"status":"Server is running"}`

**Test Frontend:**
- Visit: https://YOUR-APP.vercel.app
- Click "Cakes" → Should load cakes ✅
- Click Admin (if available) → Login with: admin@sweetoven.com / admin123
- Try uploading a cake image ✅

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check environment variables in Render |
| Frontend won't load cakes | Verify REACT_APP_API_URL is correct |
| Images not uploading | Check Cloudinary credentials in backend |
| CORS error | Update FRONTEND_URL in Render |
| "Cannot find module" | Ensure package.json has all dependencies |

---

## 📊 Your Deployed URLs

After deployment, you'll have:

- **Frontend**: `https://your-app-name.vercel.app`
- **Backend**: `https://sweetoven-backend-xxx.onrender.com`
- **Database**: MongoDB Atlas (already connected)
- **Images**: Cloudinary (already configured)

---

## 💾 Important: Keep These Safe

Save these URLs for future reference:
- Frontend URL: ________________
- Backend URL: _________________
- GitHub Repo: _________________

---

## 🔄 Update Your App Later

If you make changes:

```bash
# Local changes
git add .
git commit -m "Fix/Feature: description"
git push origin main
```

Both Render and Vercel auto-deploy when you push to main! 🎉

---

## ⚡ Performance Tips

1. **Render Free Tier Sleep**: First request takes 30 sec (cold start)
   - Solution: Keep visiting your app, or upgrade to paid tier

2. **Cloudinary**: First upload slower as it optimizes
   - Solution: This is normal, images cache after first use

3. **MongoDB Atlas**: Free tier limited to 512MB
   - Solution: Sufficient for testing, upgrade if needed

---

## 📞 Need Help?

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Docs**: https://docs.mongodb.com
- **Cloudinary Docs**: https://cloudinary.com/documentation

---

## 🎉 All Done!

Your SweetOven app is now live! Share your URLs and enjoy! 🚀
