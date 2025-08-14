const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// Check debug mode once at file load
const isDebugMode = process.env.DEBUG_MODE === "true";

const router = express.Router();

// Get all tasks for logged-in user (protected route)
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (isDebugMode) {
      console.log(`[DEBUG] Fetching tasks for user ID: ${req.user.id}`);
    }
    const result = await pool.query("SELECT * FROM tasks WHERE user_id=$1", [
      req.user.id,
    ]);
    res.json(result.rows);
  } catch (err) {
    if (isDebugMode) {
      console.error(`[DEBUG] Error fetching tasks: ${err.message}`);
    }
    res.status(500).json({ error: err.message });
  }
});

// Create new task (protected route)
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, category } = req.body;
  try {
    if (isDebugMode) {
      console.log(
        `[DEBUG] Creating task for user ID: ${req.user.id}, title: ${title}`
      );
    }
    const result = await pool.query(
      "INSERT INTO tasks (title, description, category, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description, category, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    if (isDebugMode) {
      console.error(`[DEBUG] Error creating task: ${err.message}`);
    }
    res.status(500).json({ error: err.message });
  }
});

// Update task (protected route)
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, description, category, status } = req.body;
  try {
    if (isDebugMode) {
      console.log(
        `[DEBUG] Updating task ID: ${req.params.id} for user ID: ${req.user.id}`
      );
    }
    const result = await pool.query(
      "UPDATE tasks SET title=$1, description=$2, category=$3, status=$4 WHERE id=$5 AND user_id=$6 RETURNING *",
      [title, description, category, status, req.params.id, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    if (isDebugMode) {
      console.error(`[DEBUG] Error updating task: ${err.message}`);
    }
    res.status(500).json({ error: err.message });
  }
});

// Delete task (protected route)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (isDebugMode) {
      console.log(
        `[DEBUG] Deleting task ID: ${req.params.id} for user ID: ${req.user.id}`
      );
    }
    await pool.query("DELETE FROM tasks WHERE id=$1 AND user_id=$2", [
      req.params.id,
      req.user.id,
    ]);
    res.json({ message: "Task deleted" });
  } catch (err) {
    if (isDebugMode) {
      console.error(`[DEBUG] Error deleting task: ${err.message}`);
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
