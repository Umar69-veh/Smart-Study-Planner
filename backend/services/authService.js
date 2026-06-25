const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validateEmail = (email) => {
  const v = String(email || "").trim();
  // simple but effective email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
};

const validatePasswordRules = (password) => {
  const p = String(password || "");
  const rules = {
    minLen: p.length >= 8,
    upper: /[A-Z]/.test(p),
    lower: /[a-z]/.test(p),
    number: /[0-9]/.test(p),
    special: /[^A-Za-z0-9]/.test(p),
  };

  const ok = Object.values(rules).every(Boolean);
  return { ok, rules };
};

const hashPassword = async (password) => {
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
  return bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password, passwordHash) => {
  return bcrypt.compare(password, passwordHash);
};

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || typeof secret !== "string" || !secret.trim()) {
    throw new Error("JWT_SECRET is not set in environment.");
  }
  return secret;
};

const signToken = (user) => {
  const payload = {
    sub: String(user._id),
    firstName: user.firstName,
    email: user.email,
  };

  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
};

const verifyToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};

module.exports = {
  validateEmail,
  validatePasswordRules,
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
};

