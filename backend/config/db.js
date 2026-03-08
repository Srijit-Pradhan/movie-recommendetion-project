// Step 1: Import mongoose, which is our MongoDB object modeling tool
const mongoose = require("mongoose");

// Step 2: Create an asynchronous function to connect to the database
async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);

  // সংযোগ সফল হলে console এ বার্তা দেখানো হবে।
  console.log("Connected to MongoDB");
}

// Step 6: Export the function so we can use it in server.js
module.exports = connectDB;
