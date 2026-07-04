# Yash Wankhade — MERN Portfolio

Full-stack portfolio website for Yash Wankhade, Full Stack Web & Android Developer.

**Stack:** MongoDB Atlas · Express · React (Vite) · Node.js · TailwindCSS · Framer Motion · JWT · Cloudinary · Nodemailer

## Project Structure

```
yash-portfolio/
├── server/     # Express API backend
└── client/     # React Vite frontend
```

## Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account (for image/document uploads)
- Gmail app password (for contact form emails)

## Environment Variables

### Server (`server/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | Token expiry (default: 7d) |
| `CLIENT_URL` | Frontend URL (http://localhost:5173) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `EMAIL_HOST` | SMTP host (smtp.gmail.com) |
| `EMAIL_PORT` | SMTP port (587) |
| `EMAIL_USER` | Gmail address |
| `EMAIL_PASS` | Gmail app password |
| `ADMIN_EMAIL` | Admin notification email |
| `ADMIN_PASSWORD` | Initial admin password (for setup) |

### Client (`client/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL (http://localhost:5000/api) |

## Setup

### 1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment

Copy and fill in the `.env` files in both `server/` and `client/`.

### 3. Seed the database

```bash
cd server
npm run seed
```

### 4. Create admin account (one-time)

```bash
curl -X POST http://localhost:5000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"email":"wankhadeyash2006@gmail.com","password":"YOUR_PASSWORD"}'
```

## Development

Start both servers in separate terminals:

```bash
# Backend
cd server && npm run dev

# Frontend
cd client && npm run dev
```

- Portfolio: http://localhost:5173
- Admin panel: http://localhost:5173/admin/login
- API: http://localhost:5000/api

## Build & Deploy

```bash
# Frontend production build
cd client && npm run build

# Backend production start
cd server && npm start
```

Deploy the `client/dist` folder to a static host and the server to a Node.js host. Set environment variables on both platforms.

## API Routes

| Route | Access | Description |
|---|---|---|
| `/api/auth` | Public/Admin | Login, setup, me |
| `/api/projects` | Public/Admin | Project CRUD |
| `/api/skills` | Public/Admin | Skills CRUD |
| `/api/experience` | Public/Admin | Experience CRUD |
| `/api/documents` | Public/Admin | Document upload/delete |
| `/api/messages` | Admin | Message management |
| `/api/profile` | Public/Admin | Profile read/update |
| `/api/contact` | Public | Contact form submission |

## License

Private — © Yash Wankhade
