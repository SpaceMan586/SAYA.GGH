const express = require("express");
const router = express.Router();
const PageContent = require("../models/PageContent");
const multer = require("multer");
const path = require("path");

// Multer Config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});
const upload = multer({ storage });

// @desc    Get content by section
// @route   GET /api/content/:section
router.get("/:section", async (req, res) => {
  try {
    const content = await PageContent.findOne({ section: req.params.section });
    if (content) {
      res.json(content);
    } else {
      // Return empty structure if not found
      res.json({
        section: req.params.section,
        title: "",
        subtitle: "",
        body: "",
        backgroundImage: "",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update content
// @route   POST /api/content/:section
router.post("/:section", upload.single("image"), async (req, res) => {
  try {
    const { title, subtitle, body } = req.body;
    const backgroundImage = req.file
      ? `/uploads/${req.file.filename}`
      : undefined;

    const fieldsToUpdate = { title, subtitle, body };
    if (backgroundImage) fieldsToUpdate.backgroundImage = backgroundImage;

    const content = await PageContent.findOneAndUpdate(
      { section: req.params.section },
      fieldsToUpdate,
      { new: true, upsert: true }, // Create if doesn't exist
    );

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
