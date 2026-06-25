const { verifyToken } = require("../services/authService");

module.exports = function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || typeof header !== "string") {
      return res.status(401).json({ success: false, error: "Unauthorized. Missing token." });
    }

    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ success: false, error: "Unauthorized. Invalid token format." });
    }

    const decoded = verifyToken(token);
    req.user = {
      id: decoded.sub,
      firstName: decoded.firstName,
      email: decoded.email,
    };

    return next();
  } catch (e) {
    return res.status(401).json({ success: false, error: "Unauthorized. Invalid or expired token." });
  }
};

