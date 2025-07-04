// models/Submission.js
const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  employeeName: String,
  datasetLink: String,
  users: [String], // This is 'About Dataset'
  title: String,
  district: String,
  state: String,
  extra: { type: Object }, // Can be mongoose.Schema.Types.Mixed for more flexibility
});

const SubmissionSchema = new mongoose.Schema({
  roleName: { type: String, unique: true },
  entries: [EntrySchema]
});

module.exports = mongoose.model('Submission', SubmissionSchema);