// test-db.js
require('dotenv').config();
const mongoose = require('mongoose');

async function testMongoConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ MongoDB connected successfully");
    process.exit(0); // Exit with success
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Exit with failure
  }
}

testMongoConnection();
