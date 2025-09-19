const express = require("express");
const auth = require("../middleware/authMiddleware");
const Category = require("../models/Category");

const router = express.Router();

// Get all categories for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Create category
router.post("/", auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ msg: "Category name is required" });

    const category = new Category({ name, userId: req.user });
    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Update category
router.put("/:id", auth, async (req, res) => {
  try {
    const { name } = req.body;
    let category = await Category.findOne({
      _id: req.params.id,
      userId: req.user,
    });
    if (!category) return res.status(404).json({ msg: "Category not found" });

    if (name !== undefined) category.name = name;
    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Delete category
router.delete("/:id", auth, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      userId: req.user,
    });
    if (!category) return res.status(404).json({ msg: "Category not found" });
    res.json({ msg: "Category deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
