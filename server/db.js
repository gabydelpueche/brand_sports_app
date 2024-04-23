const { Client } = require('pg');
require("dotenv").config();

// Create client object
const client = new Client({
  connectionString: process.env.DB_URL,
});

// Connect to DB
client.connect()
    .then(() => {
      console.log("Connected to DB");
    })
    .catch(err => {
      console.log("Error connecting to DB (`db.js`): ", err)
    });

// Export DB
exports.database = client;