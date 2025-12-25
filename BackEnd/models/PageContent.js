const mongoose = require('mongoose');

// Schema for dynamic page content (Hero text, About Us text, Backgrounds)
const PageContentSchema = new mongoose.Schema({
  section: { type: String, required: true, unique: true }, // e.g., 'home-hero', 'about-us', 'global-config'
  title: { type: String },
  subtitle: { type: String },
  body: { type: String },
  backgroundImage: { type: String }, // URL/Path to bg image
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PageContent', PageContentSchema);
