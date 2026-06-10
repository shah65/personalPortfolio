const mongoose = require("mongoose");

const connectionOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
};

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, connectionOptions);

    console.log(`✅ MongoDB Connected: ${mongoose.connection.name}`);
    console.log(`   Host: ${mongoose.connection.host}`);

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ Database disconnected");
    });

  } catch (err) {
    console.error(`❌ MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectToDB;