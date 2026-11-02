
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// ======================
// PROTECT ROUTES
// ======================
const protect = asyncHandler(async (req, res, next) => {
  // Allow CORS preflight requests.
  if (req.method === "OPTIONS") {
    return next();
  }

  const authHeader = req.headers.authorization;

  // Check Authorization header.
  if (!authHeader || !/^Bearer\s+/i.test(authHeader)) {
    return res.status(401).json({
      message: "No token, authorization denied",
    });
  }

  const token = authHeader.split(/\s+/)[1];

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  // Verify JWT.
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }

  // Check decoded user ID.
  if (!decoded?.id) {
    return res.status(401).json({
      message: "Invalid authentication token",
    });
  }

  // Find authenticated user in MongoDB.
  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    return res.status(401).json({
      message: "User not found",
    });
  }

  // Attach authenticated user to request.
  req.user = user;

  return next();
});

module.exports = {
  protect,
};
