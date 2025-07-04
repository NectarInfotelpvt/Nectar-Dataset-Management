// models/Resource.js
const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  link: { type: String, required: true },
  extra: mongoose.Schema.Types.Mixed, // For dynamic fields
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Resource", resourceSchema);