const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    // The single-service Render deployment serves the built React app from
    // this same Express process, so a strict default CSP would block its
    // own inline Vite-built script/style tags. Keep helmet's other
    // protections (no-sniff, frameguard, etc.) but relax just the CSP.
    contentSecurityPolicy: false,
  })
);
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/uploads/avatars', express.static(path.join(__dirname, '../uploads/avatars')));
app.use('/uploads/images', express.static(path.join(__dirname, '../uploads/images')));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
});
app.use(limiter);

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/experience', require('./routes/experienceRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// Serve the built React app (client/dist) from this same server so the
// whole site — frontend + API — runs as one Render service. In local dev
// the frontend runs separately via `vite dev` on port 5173, so this simply
// has nothing to serve there and is skipped.
const clientDistPath = path.join(__dirname, '../../client/dist');
const clientIndexPath = path.join(clientDistPath, 'index.html');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  // Anything that isn't an /api or /uploads route and isn't a real static
  // file falls through to index.html, so React Router can handle client-side
  // routes like /admin/login directly (no 404 on refresh/direct link).
  // Using a RegExp here (not a string pattern) avoids Express 5's stricter
  // path-to-regexp wildcard syntax entirely.
  app.get(/^\/(?!api|uploads).*/, (req, res, next) => {
    if (!fs.existsSync(clientIndexPath)) return next();
    res.sendFile(clientIndexPath);
  });
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

module.exports = app;
