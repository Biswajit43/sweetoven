# Integration Troubleshooting Guide

## Error: "Access to XMLHttpRequest at 'http://localhost:5000'" blocked

### Root Cause
Frontend still trying to connect to `localhost:5000` instead of production backend.

### Solution

#### ✅ Step 1: Set Vercel Environment Variables
1. Go to https://vercel.com/dashboard
2. Select your **sweetoven** project
3. Click **Settings** → **Environment Variables**
4. Add new variable:
   - **Name:** `REACT_APP_API_URL`
   - **Value:** `https://sweetoven.onrender.com`
   - Click **Save**
5. Go to **Deployments** → Click the latest one → **Redeploy**

#### ✅ Step 2: Verify Render Environment Variables
1. Go to https://dashboard.render.com
2. Select your **sweetoven** backend service
3. Click **Environment** tab
4. Verify these variables exist:
   ```
   FRONTEND_URL=https://sweetoven-2t3a-7fib0q2qb-biswajit-beras-projects.vercel.app
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=sweetoven_super_secret_jwt_key_2024
   ... other vars
   ```
5. If updated, click **Save** → Service will auto-restart

#### ✅ Step 3: Test the Connection
After deployments complete (2-3 minutes):

1. Open browser DevTools (F12)
2. Visit your Vercel frontend: https://sweetoven-2t3a-7fib0q2qb-biswajit-beras-projects.vercel.app
3. Try to login
4. Check:
   - **Network tab**: API calls should go to `https://sweetoven.onrender.com/api/*`
   - **Console tab**: Should not show CORS errors
   - **Response**: Should be successful (200-201 status)

### Why .env files don't work on Vercel/Render

- **`.env` files are in `.gitignore`** → Not pushed to git
- **Vercel/Render don't have access to your local `.env`**
- **Solution:** Use dashboard UI to set environment variables

### Important URLs

| Service | URL |
|---------|-----|
| Frontend | https://sweetoven-2t3a-7fib0q2qb-biswajit-beras-projects.vercel.app |
| Backend | https://sweetoven.onrender.com |
| Health Check | https://sweetoven.onrender.com/api/health |
| MongoDB | Your MongoDB Atlas cluster |

### Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Still showing localhost error | Wait 5 mins after Vercel redeploy, then hard refresh (Ctrl+Shift+R) |
| CORS error persists | Check Render has correct FRONTEND_URL |
| 500 errors from API | Check Render backend logs for MongoDB connection issues |
| Login not working | Verify JWT_SECRET matches between frontend and backend |
| Cloudinary upload fails | Verify CLOUDINARY_* variables in Render backend env |

### Deployment Checklist

- [x] Frontend env var set in Vercel: `REACT_APP_API_URL`
- [x] Backend env var set in Render: `FRONTEND_URL`
- [ ] Vercel redeployed (wait for green checkmark)
- [ ] Render service restarted
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Test login functionality
- [ ] Test image upload (Cloudinary)
- [ ] Test order placement

---

**Still having issues?** Check:
1. Browser Console → Copy full error
2. Network tab → Check API response status/body
3. Render logs → Service logs for backend errors
4. MongoDB Atlas → Verify connection is active
