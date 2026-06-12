const app = require("./src/app");
const connectToDB = require("./src/config/DB.config");
const seedDefaultUser = require("./src/seed"); // Import the seed function
const http = require('http');

// Connect to database
connectToDB();

// Seed default user after database connection is established
setTimeout(async () => {
  await seedDefaultUser();
}, 3000); // Wait 3 seconds for DB connection

// Create HTTP server (or HTTPS if you have certificates)
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📋 Default admin credentials will be created automatically`);
});