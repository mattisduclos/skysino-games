const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skysino';

function connectDB() {
  return mongoose.connect(MONGO_URI);
}

module.exports = connectDB;
