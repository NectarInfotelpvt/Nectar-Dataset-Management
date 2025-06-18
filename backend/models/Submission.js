const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  employeeName: String,
  datasetLink: String,
  users: [String],
});

const SubmissionSchema = new mongoose.Schema({
  roleName: { type: String, unique: true },
  entries: [EntrySchema]
});

module.exports = mongoose.model('Submission', SubmissionSchema);
  