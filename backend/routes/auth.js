const express = require("express");
const User = require("../models/User");
const authService = require("../services/authService");

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      recaptchaToken,
    } = req.body || {};

    if (!firstName || !String(firstName).trim()) {
      return res.status(400).json({ success: false, error: "First name is required." });
    }
    if (!lastName || !String(lastName).trim()) {
      return res.status(400).json({ success: false, error: "Last name is required." });
    }
    if (!email || !String(email).trim()) {
      return res.status(400).json({ success: false, error: "Email is required." });
    }
    if (!password || typeof password !== "string" || !password.trim()) {
      return res.status(400).json({ success: false, error: "Password is required." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, error: "Confirm password must match password." });
    }

    // Placeholder reCAPTCHA: require non-empty token/boolean.
    // Frontend sends `recaptchaToken: true` or a string.
    const okCaptcha = recaptchaToken === true || (typeof recaptchaToken === "string" && recaptchaToken.trim());
    if (!okCaptcha) {
      return res.status(400).json({ success: false, error: "Please verify that you are not a robot." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    if (!authService.validateEmail(normalizedEmail)) {
      return res.status(400).json({ success: false, error: "Invalid email address." });
    }

    const pw = password;
    const { ok, rules } = authService.validatePasswordRules(pw);
    if (!ok) {
      return res.status(400).json({
        success: false,
        error:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
        rules,
      });
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ success: false, error: "Email is already registered." });
    }

    const passwordHash = await authService.hashPassword(pw);

    const user = await User.create({
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      email: normalizedEmail,
      passwordHash,
    });

    const token = authService.signToken(user);

    return res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: String(user._id),
          firstName: user.firstName,
          email: user.email,
        },
      },
    });
  } catch (err) {
    return next(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !String(email).trim()) {
      return res.status(400).json({ success: false, error: "Email is required." });
    }
    if (!password || typeof password !== "string" || !password.trim()) {
      return res.status(400).json({ success: false, error: "Password cannot be empty." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    if (!authService.validateEmail(normalizedEmail)) {
      return res.status(400).json({ success: false, error: "Invalid email address." });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid email or password." });
    }

    const ok = await authService.verifyPassword(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ success: false, error: "Invalid email or password." });
    }

    const token = authService.signToken(user);

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: String(user._id),
          firstName: user.firstName,
          email: user.email,
        },
      },
    });
  } catch (err) {
    return next(err);
  }
});

// OAuth placeholders (proper implementation requires OAuth client secrets + redirect URLs)
router.post("/google", (req, res) => {
  return res.status(501).json({ success: false, error: "Google OAuth not configured." });
});

router.post("/apple", (req, res) => {
  return res.status(501).json({ success: false, error: "Apple OAuth not configured." });
});

module.exports = router;

