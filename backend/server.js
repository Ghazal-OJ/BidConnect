// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');

// Routers
const authRoutes      = require('./routes/authRoutes');
const taskRoutes      = require('./routes/taskRoutes');
const bidRoutes       = require('./routes/bidRoutes');
const projectRoutes   = require('./routes/projectRoutes');
const uploadsRouter   = require('./routes/uploads');         // file uploads (multer)
const portfolioRoutes = require('./routes/portfolioRoutes'); // freelancer portfolio

const app = express();

/* ---------- Middleware ---------- */
// Allow frontend to call this API
app.use(cors({ origin: true, credentials: true }));
// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Serve uploaded files statically: http://localhost:5001/uploads/<filename>
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

/* ---------- API Routes ---------- */
// Auth, tasks, bids
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/bids', bidRoutes);

// Projects (public reads; create/update/delete are protected in the router)
app.use('/api/projects', projectRoutes);

// Uploads (exposes POST /api/uploads and GET /api/uploads/ping)
app.use('/', uploadsRouter);

// Portfolio (freelancer: GET/PUT /api/portfolio/me)
app.use('/api/portfolio', portfolioRoutes);

// Simple health check
app.get('/health', (_req, res) => res.json({ ok: true }));

/* ---------- Start Server (only when run directly) ---------- */
if (require.main === module) {
  connectDB()
    .then(() => {
      const PORT = process.env.PORT || 5001;
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
}

module.exports = app;
