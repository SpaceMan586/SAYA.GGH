const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const loginRateLimitStore = new Map();

const getRequesterKey = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
    return forwardedFor[0];
  }

  return req.ip || req.socket?.remoteAddress || "unknown";
};

const rateLimit = ({ windowMs, max, message }) => {
  return (req, res, next) => {
    const now = Date.now();
    const key = `${req.path}:${getRequesterKey(req)}`;
    const current = loginRateLimitStore.get(key);

    if (!current || now > current.resetAt) {
      loginRateLimitStore.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return next();
    }

    if (current.count >= max) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((current.resetAt - now) / 1000),
      );
      res.set("Retry-After", String(retryAfterSeconds));
      return res.status(429).json({ message });
    }

    current.count += 1;
    loginRateLimitStore.set(key, current);
    return next();
  };
};

const toPositiveInt = (value, fallback) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
};

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: toPositiveInt(process.env.AUTH_LOGIN_MAX_ATTEMPTS, 10),
  message: "Too many login attempts. Please try again later.",
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: toPositiveInt(process.env.AUTH_REGISTER_MAX_ATTEMPTS, 5),
  message: "Too many registration attempts. Please try again later.",
});

// Generate JWT
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is required");
  }
  return secret;
};

const generateToken = (id) => {
  return jwt.sign({ id }, getJwtSecret(), {
    expiresIn: "30d",
  });
};

const requireAdminToRegister = async (req, res, next) => {
  try {
    const usersCount = await User.estimatedDocumentCount();
    if (usersCount === 0) {
      const setupKey = process.env.ADMIN_SETUP_KEY;
      const requestSetupKey = req.headers["x-setup-key"];

      if (!setupKey) {
        return res.status(503).json({
          message:
            "Initial admin bootstrap is disabled. Set ADMIN_SETUP_KEY to enable first account creation.",
        });
      }

      if (
        typeof requestSetupKey !== "string" ||
        requestSetupKey !== setupKey
      ) {
        return res.status(401).json({
          message: "Invalid setup key for initial admin bootstrap.",
        });
      }

      return next();
    }

    return protect(req, res, () => adminOnly(req, res, next));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Register a new user (Dev only or Seed)
// @route   POST /api/auth/register
router.post(
  "/register",
  registerLimiter,
  requireAdminToRegister,
  async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ email, password });
    if (user) {
      res.status(201).json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  },
);

module.exports = router;
