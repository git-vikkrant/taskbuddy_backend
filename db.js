const { Pool } = require("pg");
require("dotenv").config();

// Check debug mode once at file load
const isDebugMode = process.env.DEBUG_MODE === "true";

// Initialize PostgreSQL connection pool (centralizes DB access)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for secure DB connections (e.g., Render/Neon)
});

if (isDebugMode) {
  console.log("[DEBUG] Database pool initialized");
}

module.exports = pool;
