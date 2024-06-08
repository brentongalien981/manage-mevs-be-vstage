// config/db.js
const mongoose = require('mongoose');
const config = require('./config');
require('dotenv').config();

const connectDB = async () => {

  if (process.env.NODE_ENV === "test") {
    console.log("test env... Skipping mongodb connection.");
    return;    
  }

  try {
    await mongoose.connect(config.db.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
