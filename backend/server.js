const app = require("./src/app");
const connectToDB = require("./src/config/DB.config")
const https = require('https');
const fs = require('fs');
const path = require('path');

connectToDB();
 
// SSL options
const options = {
  key: fs.readFileSync(path.join(__dirname, "ecdsa.key")),
  cert: fs.readFileSync(path.join(__dirname, "ecdsa.cert"))
};

const Server = https.createServer(options,app);

//now create https server
const httpsServer = https.createServer(options, app);
httpsServer.listen(process.env.PORT || 3000, () => {
  console.log(`✅ HTTPS Server running at https://localhost=> ${process.env.PORT }`);
  console.log(`📋 Certificate: }`);
});