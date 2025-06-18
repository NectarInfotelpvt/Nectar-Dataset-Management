// routes/resource.js
const express = require("express");
const router = express.Router();
const Resource = require("../models/Resource");

// POST /api/resources/add
router.post("/add", async (req, res) => {
  const { title, district, state, link, extra } = req.body;

  if (!title || !district || !state || !link) {
    return res.status(400).json({ message: "All required fields not filled." });
  }

  try {
    const newResource = new Resource({ title, district, state, link, extra });
    await newResource.save();
    res.status(201).json({ message: "Resource added successfully." });
  } catch (err) {
    console.error("Error saving resource:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// GET /api/resources
router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find().sort({ title: 1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch resources." });
  }
});

module.exports = router;
