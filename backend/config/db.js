
const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is not set in .env');
    process.exit(1);
  }

  try {

    const conn = await mongoose.connect(uri);

    
    console.log('Mongo connected name:', conn.connection.name); 
    console.log('Mongo readyState:', conn.connection.readyState); 

    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
