const express = require("express");
const router = express.Router();
const Submission = require('../models/Submission');

// POST: Add a new entry to a role's submissions (push into entries array)
router.post("/add", async (req, res) => {
  const employeeName = req.body.employeeName?.trim();
  const roleName = req.body.roleName?.trim();
  const datasetLink = req.body.datasetLink?.trim();
  const usersList = req.body.usersList?.trim();

  if (!employeeName || !roleName || !datasetLink || !usersList) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const users = usersList.split(",").map(u => u.trim()).filter(Boolean);
    const newEntry = { employeeName, datasetLink, users };

    const updatedSubmission = await Submission.findOneAndUpdate(
      { roleName },
      { $push: { entries: newEntry } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ message: "Submission saved or updated successfully." });
  } catch (error) {
    console.error("Error saving/updating submission for role:", roleName, error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET: All roles with their entries (grouped)
router.get("/roles", async (req, res) => {
  try {
    const roles = await Submission.find();
    const transformed = {};
    roles.forEach((roleDoc) => {
      transformed[roleDoc.roleName] = roleDoc.entries;
    });
    res.json(transformed);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET: All submissions (flat list)
router.get("/submissions", async (req, res) => {
  try {
    const submissions = await Submission.find();
    res.json(submissions);
  } catch (error) {
    console.error("Error fetching all submissions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET: Submission by employee name
router.get("/employee/:name", async (req, res) => {
  const employeeName = req.params.name.trim();
  try {
    const submission = await Submission.findOne({ "entries.employeeName": employeeName });
    if (!submission) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Find the specific entry for the employee in the entries array
    const employeeEntry = submission.entries.find(e => e.employeeName === employeeName);
    if (!employeeEntry) {
      return res.status(404).json({ message: "Employee entry not found" });
    }

    res.json({ roleName: submission.roleName, ...employeeEntry });
  } catch (error) {
    console.error("Error fetching submission by employee:", employeeName, error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
