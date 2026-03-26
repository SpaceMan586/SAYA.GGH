const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const multer = require("multer");
const path = require("path");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Multer Config
const allowedImageMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const maxUploadBytes = Number(process.env.MAX_UPLOAD_BYTES || 5 * 1024 * 1024);

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
const upload = multer({
  storage,
  limits: {
    fileSize:
      Number.isFinite(maxUploadBytes) && maxUploadBytes > 0
        ? maxUploadBytes
        : 5 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    if (allowedImageMimeTypes.has(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error("Only image uploads are allowed"));
  },
});

// @desc    Get all projects
// @route   GET /api/projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single project
// @route   GET /api/projects/:id
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a project
// @route   POST /api/projects
router.post("/", protect, adminOnly, upload.single("image"), async (req, res) => {
  try {
    const { title, location, year, status, description, category } = req.body;

    // Construct image path if file uploaded
    const heroImage = req.file ? `/uploads/${req.file.filename}` : "";

    const project = new Project({
      title,
      location,
      year,
      status,
      description,
      category,
      heroImage,
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      await project.deleteOne();
      res.json({ message: "Project removed" });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
