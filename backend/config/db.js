// backend/config/db.js
// This file creates a connection pool to MySQL
// A "pool" means it keeps multiple connections ready for efficiency

const mysql = require('mysql2/promise'); // mysql2 with Promise support (for async/await)
require('dotenv').config(); // Load variables from .env file

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,         // e.g. 'localhost'
  user: process.env.DB_USER,         // e.g. 'root'
  password: process.env.DB_PASSWORD, // your MySQL password
  database: process.env.DB_NAME,     // e.g. 'zepnest_db'
  waitForConnections: true,
  connectionLimit: 10,               // Max 10 simultaneous connections
  queueLimit: 0
});

// Test the connection when this file is loaded
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL Connected Successfully');
    conn.release(); // Release the connection back to the pool
  })
  .catch(err => {
    console.error('❌ MySQL Connection Failed:', err.message);
    process.exit(1); // Stop the server if DB fails
  });

module.exports = pool; // Export so other files can use it