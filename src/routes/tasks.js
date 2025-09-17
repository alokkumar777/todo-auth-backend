const express = require("express");
const auth = require("../middleware/authMiddleware");
const Task = require("../models/Task");

const router = express.Router();

// Get tasks (with optional filters: category, completed)
router.get("/", auth, async (req, res) => {
  try {
    const { category, completed } = req.query;

    let filter = { userId: req.user };

    if (category) filter.categoryId = category;
    if (completed !== undefined) filter.completed = completed === "true";

    const tasks = await Task.find(filter).populate("categoryId", "name");
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Create task
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, categoryId } = req.body;

    if (!title) return res.status(400).json({ msg: "Task title is required" });

    const task = new Task({
      title,
      description,
      categoryId: categoryId || null,
      userId: req.user,
    });

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Update task
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, completed, categoryId } = req.body;

    let task = await Task.findOne({ _id: req.params.id, userId: req.user });
    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;
    if (categoryId !== undefined) task.categoryId = categoryId;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Delete task
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user,
    });
    if (!task) return res.status(404).json({ msg: "Task not found" });

    res.json({ msg: "Task deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
