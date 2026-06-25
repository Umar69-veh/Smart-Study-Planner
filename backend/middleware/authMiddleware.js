const { verifyToken } = require("../services/authService");

module.exports = function authMiddleware(req, res, next) {
  console.log("========== AUTH ==========");
  console.log("Authorization Header:", req.headers.authorization);
  console.log("All Headers:", req.headers);

  try {
    const header = req.headers.authorization;

    if (!header || typeof header !== "string") {
      return res.status(401).json({
        success: false,
        error: "Unauthorized. Missing token.",
      });
    }

    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized. Invalid token format.",
      });
    }

    const decoded = verifyToken(token);

    req.user = {
      id: decoded.sub,
      firstName: decoded.firstName,
      email: decoded.email,
    };

    next();
  } catch (err) {
    console.error("JWT Error:", err.message);

    return res.status(401).json({
      success: false,
      error: "Unauthorized. Invalid or expired token.",
    });
  }
};