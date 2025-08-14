const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
require("dotenv").config();

// Check debug mode once at file load
const isDebugMode = process.env.DEBUG_MODE === "true";

const router = express.Router();

// Signup: Create a new user with hashed password
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Hash password for security (prevents storing plain text)
    const hashedPassword = await bcrypt.hash(password, 10);
    if (isDebugMode) {
      console.log(`[DEBUG] Creating user with email: ${email}`);
    }
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );
    if (isDebugMode) {
      console.log(`[DEBUG] User created: ${email}`);
    }
    res.json(result.rows[0]);
  } catch (err) {
    if (isDebugMode) {
      console.error(`[DEBUG] Error in signup: ${err.message}`);
    }
    res.status(500).json({ error: err.message });
  }
});

// Login: Authenticate user and issue JWT token
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (isDebugMode) {
      console.log(`[DEBUG] Login attempt for email: ${email}`);
    }
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (result.rows.length === 0) {
      if (isDebugMode) {
        console.log(`[DEBUG] User not found: ${email}`);
      }
      return res.status(400).json({ message: "User not found" });
    }

    const user = result.rows[0];
    // Verify password against stored hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      if (isDebugMode) {
        console.log(`[DEBUG] Invalid password for email: ${email}`);
      }
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT for secure user sessions
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    if (isDebugMode) {
      console.log(`[DEBUG] Token generated for user: ${email}`);
    }
    res.json({ token });
  } catch (err) {
    if (isDebugMode) {
      console.error(`[DEBUG] Error in login: ${err.message}`);
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
