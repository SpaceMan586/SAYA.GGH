const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: "Residential" }, // Residential, Commercial, etc.
  location: { type: String, required: true },
  year: { type: String, required: true },
  status: { type: String, default: "On Going" },
  description: { type: String },
  constructionArea: { type: String },
  sideArea: { type: String },
  heroImage: { type: String }, // Path to image
  gallery: [{ type: String }], // Array of image paths
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", ProjectSchema);
