# ✅ SweetOven - Deployment Checklist

## Pre-Deployment Checklist (Local)

- [ ] All code tested locally
- [ ] Backend runs without errors
- [ ] Frontend loads without errors
- [ ] Admin login works
- [ ] Cake upload to Cloudinary works
- [ ] Cakes load on frontend
- [ ] Images appear correctly
- [ ] API calls working
- [ ] No console errors

## GitHub Setup

- [ ] GitHub account created
- [ ] Repository created (sweetoven)
- [ ] Code pushed to GitHub
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git push origin main
  ```

## Backend Deployment (Render)

### Account Setup
- [ ] Render account created
- [ ] GitHub connected to Render
- [ ] Render dashboard accessed

### Web Service Creation
- [ ] New Web Service created
- [ ] GitHub repo selected (sweetoven)
- [ ] **Name**: sweetoven-backend
- [ ] **Root Directory**: backend
- [ ] **Environment**: Node
- [ ] **Build Command**: `npm install`
- [ ] **Start Command**: `npm start`
- [ ] **Plan**: Free (or paid if you want)

### Environment Variables Set
- [ ] PORT = 10000
- [ ] MONGO_URI = (your MongoDB connection)
- [ ] JWT_SECRET = sweetoven_super_secret_jwt_key_2024
- [ ] ADMIN_EMAIL = admin@sweetoven.com
- [ ] ADMIN_PASSWORD = admin123
- [ ] CLOUDINARY_CLOUD_NAME = dla1ri110
- [ ] CLOUDINARY_API_KEY = 316972792766635
- [ ] CLOUDINARY_API_SECRET = 1Ridh6zTYwgIKNMqhZ6amPqC6xc
- [ ] FRONTEND_URL = (will update after Vercel deployment)

### Deployment
- [ ] Deploy button clicked
- [ ] Build process watched
- [ ] Deployment successful
- [ ] **Backend URL copied**: https://_____.onrender.com

### Testing Backend
- [ ] Backend URL accessible in browser
- [ ] `/api/health` endpoint returns status
- [ ] `/api/cakes` returns JSON

## Frontend Deployment (Vercel)

### Account Setup
- [ ] Vercel account created
- [ ] GitHub connected to Vercel
- [ ] Vercel dashboard accessed

### Project Creation
- [ ] New Project created
- [ ] GitHub repo selected (sweetoven)
- [ ] **Framework Preset**: React
- [ ] **Root Directory**: frontend
- [ ] **Build Command**: `npm run build`
- [ ] **Output Directory**: build

### Environment Variables Set
- [ ] REACT_APP_API_URL = https://_____.onrender.com (your backend URL)

### Deployment
- [ ] Deploy button clicked
- [ ] Build process watched
- [ ] Deployment successful
- [ ] **Frontend URL copied**: https://_____.vercel.app

### Testing Frontend
- [ ] Frontend URL accessible in browser
- [ ] Home page loads
- [ ] Cakes page loads and shows cakes
- [ ] Images display correctly
- [ ] No console errors

## Backend CORS Update

- [ ] Go back to Render Backend Dashboard
- [ ] Edit Environment Variables
- [ ] Update FRONTEND_URL = https://_____.vercel.app
- [ ] Save changes (backend auto-redeploys)
- [ ] Wait for redeploy to complete

## Post-Deployment Testing

### Frontend Features
- [ ] Home page displays correctly
- [ ] Cakes page loads cakes
- [ ] Search functionality works
- [ ] Category filter works
- [ ] Cake detail page works
- [ ] Responsive on mobile

### User Authentication
- [ ] Login page accessible
- [ ] Register page works
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Profile page works
- [ ] Can update profile
- [ ] Logout works

### Admin Panel
- [ ] Can login with admin credentials
- [ ] Admin dashboard displays
- [ ] Stats show correctly
- [ ] Can add new cake
- [ ] **Image upload works** ← CRITICAL
- [ ] Image appears in cake card
- [ ] Can edit cake
- [ ] Can delete cake
- [ ] Customer list works
- [ ] Orders list works

### API Testing (curl or Postman)
```bash
# Test public API
curl https://_____.onrender.com/api/cakes

# Test health endpoint
curl https://_____.onrender.com/api/health

# Should return JSON arrays
```

## Performance Check

- [ ] First page load < 3 seconds
- [ ] Images load within 2 seconds
- [ ] API responses < 1 second
- [ ] No 404 errors in console
- [ ] No CORS errors

## Documentation

- [ ] README.md updated
- [ ] Deployment URLs documented
- [ ] Admin credentials documented
- [ ] Setup steps documented

## Final Checks

- [ ] All features working
- [ ] No console errors
- [ ] No network errors
- [ ] Mobile responsive
- [ ] Admin panel functional
- [ ] Images uploading correctly
- [ ] Database connection working
- [ ] Authentication working

## Launch Announcement

- [ ] Share frontend URL with team
- [ ] Share admin credentials securely
- [ ] Create admin account for yourself
- [ ] Test one complete order flow
- [ ] Confirm everything working

---

## 🎯 If Something Goes Wrong

### Backend Won't Start
1. Check environment variables on Render
2. Check logs on Render dashboard
3. Verify MongoDB URI is correct
4. Look for syntax errors in code

### Frontend Won't Load
1. Check REACT_APP_API_URL variable
2. Check Vercel build logs
3. Verify backend URL is correct
4. Check browser console for errors

### Images Not Uploading
1. Check Cloudinary credentials
2. Check backend logs for upload errors
3. Verify Cloudinary account has credits
4. Check file size (< 5MB)

### CORS Errors
1. Update FRONTEND_URL on backend
2. Restart backend on Render
3. Check backend CORS configuration
4. Wait 5 minutes for propagation

### API Calls Failing
1. Check backend is running
2. Check REACT_APP_API_URL is correct
3. Check network tab in browser (F12)
4. Check backend logs for errors

---

## 📊 Deployment Metrics

**Ideal Times:**
- Backend Deploy: 3-5 minutes
- Frontend Deploy: 2-3 minutes
- Backend to wake up (free tier): 30 seconds
- First page load: 2-3 seconds

---

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Frontend loads without errors
- ✅ Cakes display on the page
- ✅ Images from Cloudinary appear
- ✅ Admin login works
- ✅ Can upload new cake with image
- ✅ Uploaded image appears immediately
- ✅ No console errors
- ✅ No network errors

---

## 📝 URLs to Save

```
Frontend URL: ________________________
Backend URL: ________________________
GitHub Repo: ________________________
Admin Email: admin@sweetoven.com
Admin Pass: admin123
```

---

## 🚀 You're Ready!

Follow this checklist and you'll have a production-ready SweetOven app deployed! 🎂✨

**Questions?** Check DEPLOYMENT_GUIDE.md or QUICK_DEPLOY.md

Good luck! 🎉
