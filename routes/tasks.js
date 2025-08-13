const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all tasks for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks WHERE user_id=$1", [
      req.user.id,
    ]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new task
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, category } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO tasks (title, description, category, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description, category, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, description, category, status } = req.body;
  try {
    const result = await pool.query(
      "UPDATE tasks SET title=$1, description=$2, category=$3, status=$4 WHERE id=$5 AND user_id=$6 RETURNING *",
      [title, description, category, status, req.params.id, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete task
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await pool.query("DELETE FROM tasks WHERE id=$1 AND user_id=$2", [
      req.params.id,
      req.user.id,
    ]);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
