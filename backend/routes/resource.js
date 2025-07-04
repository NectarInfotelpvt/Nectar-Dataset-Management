// routes/resource.js
const express = require("express");
const router = express.Router();
const Resource = require("../models/Resource");

router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/add", async (req, res) => {
  const { title, district, state, link, extra } = req.body;

  if (!title || !district || !state || !link) {
    return res.status(400).json({ message: "All required resource fields (title, district, state, link) are necessary." });
  }

  try {
    const newResource = new Resource({
      title,
      district,
      state,
      link,
      extra: extra || {},
    });
    await newResource.save();
    res.status(201).json({ message: "Resource added successfully!", resource: newResource });
  } catch (error) {
    console.error("Error adding resource:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// NEW DELETE Route for Resources
// Endpoint: DELETE /api/resources/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedResource = await Resource.findByIdAndDelete(id);

    if (!deletedResource) {
      return res.status(404).json({ message: "Resource not found." });
    }

    res.status(200).json({ message: "Resource deleted successfully." });
  } catch (error) {
    console.error("Error deleting resource:", id, error);
    if (error.name === 'CastError') { // Handles invalid MongoDB ID format
        return res.status(400).json({ message: 'Invalid resource ID format.' });
    }
    res.status(500).json({ message: "Server error during resource deletion.", error: error.message });
  }
});


module.exports = router;