// routes/submissionRoutes.js
const express = require("express");
const router = express.Router();
const Submission = require('../models/Submission');

router.post("/add", async (req, res) => {
  const employeeName = req.body.employeeName?.trim() || "";
  const roleName = req.body.roleName?.trim() || "";
  const datasetLink = req.body.datasetLink?.trim() || "";
  const usersList = req.body.aboutDataset?.trim() || "";
  const title = req.body.title?.trim() || "";
  const district = req.body.district?.trim() || "";
  const state = req.body.state?.trim() || "";
  const extra = req.body.extra || {};

  if (!roleName) {
    return res.status(400).json({ message: "Role / Designation is required." });
  }

  try {
    const users = usersList.split(",").map(u => u.trim()).filter(Boolean);

    const newEntry = {
      employeeName,
      datasetLink,
      users,
      title,
      district,
      state,
      extra
    };

    const updatedSubmission = await Submission.findOneAndUpdate(
      { roleName },
      { $push: { entries: newEntry } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ message: "Submission saved or updated successfully." });
  } catch (error) {
    console.error("Error saving/updating submission:", error);
    res.status(500).json({ message: "Server error during submission.", error: error.message });
  }
});

router.get("/roles", async (req, res) => {
  try {
    const roles = await Submission.find();
    const transformed = {};
    roles.forEach((roleDoc) => {
      // Ensure _id is passed as a string for frontend deletion
      transformed[roleDoc.roleName] = roleDoc.entries.map(entry => ({
          ...entry.toObject(),
          _id: entry._id.toString()
      }));
    });
    res.json(transformed);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/submissions", async (req, res) => {
  try {
    const submissions = await Submission.find();
    res.json(submissions);
  } catch (error) {
    console.error("Error fetching all submissions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/employee/:name", async (req, res) => {
  const employeeName = req.params.name.trim();
  try {
    const submission = await Submission.findOne({ "entries.employeeName": employeeName });
    if (!submission) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const employeeEntry = submission.entries.find(e => e.employeeName === employeeName);
    if (!employeeEntry) {
      return res.status(404).json({ message: "Employee entry not found" });
    }

    res.json({ roleName: submission.roleName, ...employeeEntry.toObject() });
  } catch (error) {
    console.error("Error fetching submission by employee:", employeeName, error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// NEW DELETE Route for a specific entry within a role
// Endpoint: DELETE /api/submission/delete/:entryId
router.delete("/delete/:entryId", async (req, res) => {
  const { entryId } = req.params;

  try {
    const updatedSubmission = await Submission.findOneAndUpdate(
      { "entries._id": entryId }, // Find the document where an entry has this _id
      { $pull: { entries: { _id: entryId } } }, // Remove that specific entry from the array
      { new: true } // Return the updated document
    );

    if (!updatedSubmission) {
      return res.status(404).json({ message: "Entry not found in any submission." });
    }

    res.status(200).json({ message: "Entry deleted successfully from submission." });
  } catch (error) {
    console.error("Error deleting submission entry:", entryId, error);
    if (error.name === 'CastError') { // Handles invalid MongoDB ID format
        return res.status(400).json({ message: 'Invalid entry ID format.' });
    }
    res.status(500).json({ message: "Server error during entry deletion.", error: error.message });
  }
});


module.exports = router;