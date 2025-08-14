// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is not set in .env');
    process.exit(1);
  }

  try {
    // اختیاری؛ برای حذف بعضی هشدارها:
    // mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(uri);

    // لاگ‌های قطعی برای تشخیص اینکه دقیقاً به کجا وصل شدی
    console.log('Mongo connected name:', conn.connection.name); // ← باید Ghazal_OJ_DATABASE باشه
    console.log('Mongo host:', conn.connection.host);
    console.log('Mongo readyState:', conn.connection.readyState); // 1 = connected

    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
