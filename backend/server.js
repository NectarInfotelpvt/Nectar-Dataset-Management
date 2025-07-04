// server.js
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Apply CORS FIRST — before routes
app.use(cors({
  origin: ["http://localhost:5173", "https://nectar-dataset-management-live.onrender.com"],
  credentials: true,
}));

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const resourceRoutes = require("./routes/resource");
const submissionRouter = require('./routes/submissionRoutes');
const authRoutes = require("./routes/authRoutes"); // Assuming you have auth routes

app.use("/api/resources", resourceRoutes);
app.use("/api/submission", submissionRouter);
app.use("/api", authRoutes); // Assuming this handles /api/login, /api/register etc.

app.get("/", (req, res) => {
  res.send("✅ Nectar API is running...");
});

// MongoDB connection and server start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });