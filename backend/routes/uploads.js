const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), 'uploads');
    fs.mkdirSync(dir, { recursive: true }); // Create folder if missing
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '-');
    cb(null, `${Date.now()}-${base}${ext}`);
  }
});

// No file filter or size limit (for testing only)
const upload = multer({ storage });

/**
 * Simple test endpoint to check if upload routes are working
 */
router.get('/api/uploads/ping', (_req, res) => res.send('ok'));

/**
 * Handle file uploads
 * - Accepts any type of file
 * - Saves them using the above storage config
 * - Returns an array of uploaded file URLs and original names
 */
router.post('/api/uploads', upload.any(), (req, res) => {
  console.log('CT:', req.headers['content-type']);
  console.log(
    'FILES:',
    (req.files || []).map(f => ({
      field: f.fieldname,
      name: f.originalname,
      type: f.mimetype,
      size: f.size
    }))
  );

  const base = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  const payload = (req.files || []).map(f => ({
    url: `${base}/uploads/${f.filename}`,
    name: f.originalname
  }));

  return res.status(201).json(payload);
});

module.exports = router;
