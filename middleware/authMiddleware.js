const jwt = require("jsonwebtoken");

// Check debug mode once at file load
const isDebugMode = process.env.DEBUG_MODE === "true";

// Middleware to verify JWT token (secures routes by ensuring valid user authentication)
module.exports = function (req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    if (isDebugMode) {
      console.log("[DEBUG] No token provided in request");
    }
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify token and attach user data to request
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // user.id will be available
    if (isDebugMode) {
      console.log(`[DEBUG] Token verified for user ID: ${decoded.id}`);
    }
    next();
  } catch (err) {
    if (isDebugMode) {
      console.error(`[DEBUG] Invalid token: ${err.message}`);
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};
