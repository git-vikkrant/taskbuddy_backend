const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Check debug mode once at file load
const isDebugMode = process.env.DEBUG_MODE === "true";

// Import route handlers for authentication and task management
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();

// Enable CORS for cross-origin requests (essential for frontend-backend communication)
app.use(cors());
// Parse JSON request bodies (required for handling POST/PUT data)
app.use(express.json());

// Routes for authentication and task management
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Start the server on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  // Log server start (only in debug mode)
  if (isDebugMode) {
    console.log(`[DEBUG] Server running on port ${PORT}`);
  }
});
