# Local Setup Guide (No Cloud Required)

Run the entire portfolio on your PC using **local MongoDB** and **local file storage**. No Atlas, Cloudinary, or deployment needed.

## What runs locally

| Feature | Local setup |
|---|---|
| Database | MongoDB on `127.0.0.1:27017` |
| File uploads | Saved in `server/uploads/` |
| Contact form | Saved to database (email optional) |
| Website | http://localhost:5173 |
| Admin panel | http://localhost:5173/admin/login |

---

## Step 1 — Install MongoDB (one time)

1. Download MongoDB Community Server from the official MongoDB website.
2. Choose **Windows → MSI**
3. Install with **Complete** setup
4. Enable **Install MongoDB as a Service**

---

## Step 2 — Install project dependencies (one time)

Open PowerShell:

```powershell
cd d:\MyPortfolio\yash-portfolio\server
npm install

cd d:\MyPortfolio\yash-portfolio\client
npm install
```

---

## Step 3 — Setup database + admin (one time)

```powershell
cd d:\MyPortfolio\yash-portfolio\server
npm run setup:local
```

This will:
- Connect to local MongoDB
- Add your profile, skills, experience, and projects
- Create admin login

**Default admin login:**
- Email: `wankhadeyash2006@gmail.com`
- Password: `admin123`

(Change `ADMIN_PASSWORD` in `server/.env` before running setup if you want a different password.)

---

## Step 4 — Start the app (every time)

**Terminal 1 — Backend:**
```powershell
cd d:\MyPortfolio\yash-portfolio\server
npm run dev
```

**Terminal 2 — Frontend:**
```powershell
cd d:\MyPortfolio\yash-portfolio\client
npm run dev
```

---

## Step 5 — Open in browser

| Page | URL |
|---|---|
| Portfolio | http://localhost:5173 |
| Admin login | http://localhost:5173/admin/login |

---

## Add your details

Login to admin → edit Profile, Projects, Skills, Experience, Documents.

**New in this version:**
- **Profile → Site Theme**: pick a primary/accent color (or a preset) and the whole public site re-colors instantly — no code changes or rebuild needed.
- **Profile → Resume**: upload your resume PDF directly from the admin panel. The "Download Resume" button on the homepage and the Documents section will serve this file automatically.
- **Documents section**: anything you upload in Admin → Documents (resume, offer letters, certificates) now shows publicly on the homepage, grouped by category, with View/Download buttons.

Uploaded photos and files are stored in:
```
d:\MyPortfolio\yash-portfolio\server\uploads\
```

---

## If setup fails

**"MongoDB connection error"**
- MongoDB is not installed or not running
- Open **Services** on Windows → find **MongoDB** → Start it
- Or reinstall MongoDB Community Server

**"Admin already exists"**
- Normal if you ran setup before — just login with your password

**Contact form doesn't send email**
- Expected in local mode — messages still appear in Admin → Messages

---

## Environment file (already configured)

`server/.env`:
```env
MONGO_URI=mongodb://127.0.0.1:27017/yash-portfolio
SERVER_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
```

No cloud keys required.
