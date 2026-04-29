# 🚀 QuickCommerce — Full Deployment Guide

> **Stack**: React + Vite (Vercel) · Express + Node.js (Render) · MongoDB Atlas

---

## ✅ Pre-Deployment Checklist

Before doing anything, confirm these are done:
- [x] `npm run build` succeeds in `/client`
- [x] `server/.env` has `ALLOWED_ORIGINS` set
- [x] `AuthContext.jsx` uses `import.meta.env.VITE_API_URL`
- [x] `vercel.json` exists in `/client`
- [x] `client/public/_redirects` exists
- [x] Root `.gitignore` excludes all `.env` files

---

## Step 1 — MongoDB Atlas Setup

> [!IMPORTANT]
> You must do this first. Your backend needs a live database URL before you can deploy.

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → **Sign Up / Log In**
2. Click **"Build a Database"** → Choose **Free (M0 Shared)**
3. Select your cloud provider (AWS) and region (closest to you)
4. Click **"Create Cluster"** — wait ~2 minutes

### Create a Database User
5. Left sidebar → **Database Access** → **Add New Database User**
6. Authentication: **Password**
7. Username: `quickcommerce_user`
8. Password: Click **"Autogenerate Secure Password"** → **Copy and save it**
9. Database User Privileges: **Read and write to any database**
10. Click **Add User**

### Whitelist All IPs (for Render)
11. Left sidebar → **Network Access** → **Add IP Address**
12. Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
13. Click **Confirm**

### Get Your Connection String
14. Left sidebar → **Database** → Click **Connect** on your cluster
15. Choose **"Drivers"** → Driver: **Node.js**, Version: **5.5 or later**
16. Copy the connection string — it looks like:
```
mongodb+srv://quickcommerce_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
17. Replace `<password>` with your actual password
18. Add your database name before `?`:
```
mongodb+srv://quickcommerce_user:yourpassword@cluster0.xxxxx.mongodb.net/quickcommerce?retryWrites=true&w=majority
```
19. **Save this string** — you'll paste it into Render

---

## Step 2 — Push Code to GitHub

> [!CAUTION]
> Double-check that `.env` files are NOT being tracked before pushing!

Open a terminal in your project root (`/12345`):

```bash
# Initialize git (if not already done)
git init

# Check what will be committed — .env files must NOT appear here
git status

# If .env files show up, run this to untrack them:
git rm --cached server/.env
git rm --cached client/.env

# Stage all files
git add .

# Commit
git commit -m "feat: production-ready MERN quick-commerce app"

# Create repo on GitHub (go to github.com → New Repository)
# Name it: quickcommerce  (set to Public or Private)
# DO NOT initialize with README (your repo already has one)

# Link and push
git remote add origin https://github.com/YOUR_USERNAME/quickcommerce.git
git branch -M main
git push -u origin main
```

---

## Step 3 — Deploy Backend on Render

1. Go to [render.com](https://render.com) → **Sign Up / Log In** with GitHub
2. Click **"New +"** → **Web Service**
3. Connect your GitHub account → Select your `quickcommerce` repository
4. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `quickcommerce-api` |
| **Root Directory** | `server` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

5. Click **"Add Environment Variables"** — add ALL of these:

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `MONGO_URI` | *(your Atlas connection string from Step 1)* |
| `JWT_SECRET` | *(generate with command below)* |
| `NODE_ENV` | `production` |
| `ALLOWED_ORIGINS` | *(leave blank for now — fill in after Vercel deploy)* |

### Generate a Strong JWT Secret
Run this in your terminal and paste the output:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

6. Click **"Create Web Service"**
7. Wait for deploy (~3-5 min). When you see **"Live"**, copy your URL:
```
https://quickcommerce-api.onrender.com
```

> [!TIP]
> Free Render instances **spin down after 15 min of inactivity** and take ~30s to wake up on first request. This is normal on the free tier.

---

## Step 4 — Deploy Frontend on Vercel

> [!IMPORTANT]
> Do this AFTER Step 3. You need the Render URL first.

1. Go to [vercel.com](https://vercel.com) → **Sign Up / Log In** with GitHub
2. Click **"Add New Project"**
3. Import your `quickcommerce` GitHub repository
4. Configure the project:

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `client` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

5. Under **"Environment Variables"**, add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://quickcommerce-api.onrender.com/api` |

*(Replace `quickcommerce-api` with your actual Render service name)*

6. Click **"Deploy"**
7. When done, copy your Vercel URL:
```
https://quickcommerce.vercel.app
```

---

## Step 5 — Connect Frontend ↔ Backend (CORS)

Now that you have both URLs, go back to Render:

1. Render Dashboard → Your service → **Environment**
2. Edit `ALLOWED_ORIGINS` → set it to your Vercel URL:
```
https://quickcommerce.vercel.app
```
3. Click **Save** — Render will auto-redeploy (takes ~2 min)

---

## Step 6 — Seed the Database (Optional)

To add initial products to your Atlas database, run `seed.js` locally but pointed at Atlas:

1. Temporarily edit `server/.env`:
```env
MONGO_URI=mongodb+srv://quickcommerce_user:yourpassword@cluster0.xxxxx.mongodb.net/quickcommerce?retryWrites=true&w=majority
```

2. Run the seed script:
```bash
cd server
node seed.js
```

3. Restore `server/.env` back to localhost for local dev

---

## Environment Variable Reference

### Backend (Render) — All Required
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for signing JWTs (min 64 chars) | `a3f8b2...` (hex) |
| `NODE_ENV` | Environment mode | `production` |
| `ALLOWED_ORIGINS` | Frontend URL for CORS | `https://yourapp.vercel.app` |

### Frontend (Vercel) — All Required
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `https://quickcommerce-api.onrender.com/api` |

---

## Common Deployment Errors & Fixes

### 🔴 "Network Error" / API calls fail in production
**Cause**: `VITE_API_URL` not set in Vercel, or wrong value  
**Fix**: Vercel → Project → Settings → Environment Variables → check `VITE_API_URL`  
**Check**: Open browser DevTools → Network tab → see what URL API calls are hitting

### 🔴 CORS Error in browser console
**Cause**: `ALLOWED_ORIGINS` on Render doesn't match your Vercel URL exactly  
**Fix**: Must be exact URL with no trailing slash: `https://yourapp.vercel.app`  
**Fix**: Trigger Render redeploy after updating env var

### 🔴 `/products` or `/cart` shows 404 on page refresh
**Cause**: SPA routing not configured  
**Fix**: `client/vercel.json` with rewrites is already added ✅

### 🔴 "Cannot GET /" on Render backend URL
**This is normal** — your backend has no `/` route, only `/api/*` routes  
**Test**: Visit `https://your-api.onrender.com/api/health` — should return `{"status":"API is running"}`

### 🔴 MongoDB connection fails on Render
**Cause 1**: Wrong Atlas URI (password has special chars not URL-encoded)  
**Fix**: URL-encode special chars in password, e.g. `@` → `%40`  
**Cause 2**: IP not whitelisted  
**Fix**: Atlas → Network Access → ensure `0.0.0.0/0` is listed

### 🟡 Render service keeps restarting
**Cause**: Missing environment variables (app crashes on startup)  
**Fix**: Check Render logs — look for `Error:` lines

### 🟡 JWT token errors after deploy
**Cause**: JWT_SECRET changed between dev and prod — existing tokens are invalid  
**Fix**: Normal behavior — users just need to log in again

### 🟡 Images not loading (if you have product images)
**Cause**: Image URLs are hardcoded to localhost  
**Fix**: Use a CDN (Cloudinary) or store image URLs in your database that point to hosted images

---

## Final Live App Checklist

Test these in order after both services are deployed:

### Auth
- [ ] Register a new account → redirects to home
- [ ] Login with that account → redirects to home
- [ ] Refresh page → user stays logged in
- [ ] Logout → redirects to `/login`

### Products
- [ ] `/products` loads all products from live backend
- [ ] Click a product → `/products/:id` loads details
- [ ] Search/filter works (if implemented)

### Cart
- [ ] Add product to cart
- [ ] Cart count updates in navbar
- [ ] Go to `/cart` → items visible
- [ ] Refresh `/cart` → items still there (localStorage)

### Checkout & Orders
- [ ] Go to `/checkout` → form appears
- [ ] Place order → success message
- [ ] Order appears in database (check Atlas → Browse Collections)

### Admin
- [ ] Login with admin account
- [ ] Visit `/admin/dashboard` → dashboard loads
- [ ] Non-admin users can't access `/admin`

### SPA Routing
- [ ] Navigate to `/products` then press browser **Refresh** → no 404
- [ ] Type `https://yourapp.vercel.app/cart` directly in URL bar → loads correctly

### No Dev Artifacts
- [ ] Open DevTools → Network tab → no calls to `localhost:5000`
- [ ] Console has no red errors

---

## Quick Reference Commands

```bash
# Run locally (full stack)
npm run dev          # from root /12345

# Build frontend only
npm run build        # from root /12345

# Run backend only (production mode)
cd server && NODE_ENV=production npm start

# Seed database
cd server && node seed.js

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Project URLs (fill in after deploy)

| Service | URL |
|---------|-----|
| Frontend (Vercel) | `https://_________________.vercel.app` |
| Backend (Render) | `https://_________________.onrender.com` |
| API Health Check | `https://_________________.onrender.com/api/health` |
| MongoDB Atlas | `https://cloud.mongodb.com` |
