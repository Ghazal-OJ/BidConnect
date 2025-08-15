require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const connectDB = require('./config/db');

// Routers
const authRoutes      = require('./routes/authRoutes');
const taskRoutes      = require('./routes/taskRoutes');
const bidRoutes       = require('./routes/bidRoutes');
const projectRoutes   = require('./routes/projectRoutes');
const uploadsRouter   = require('./routes/uploads');          // file uploads (multer)
const portfolioRoutes = require('./routes/portfolioRoutes');  // freelancer portfolioComingsoon

const app = express();


app.use(cors({ origin: true, credentials: true }));
// JSON parser
app.use(express.json({ limit: '10mb' }));


app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

/* ---------- API Routes ---------- */
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/projects', projectRoutes);
app.use('/', uploadsRouter);
app.use('/api/portfolio', portfolioRoutes);

// health check
app.get('/health', (_req, res) => res.json({ ok: true }));

/* ---------- Start Server ---------- */
if (require.main === module) {
  connectDB()
    .then(() => {
      
      mongoose.connection.once('open', () => {
        console.log('Mongo connected name:', mongoose.connection.name);
        console.log('Mongo host:', mongoose.connection.host);
      });

      const PORT = process.env.PORT || 5001;
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
}

module.exports = app;
