const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Kontrollojmë nëse ekziston Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Marrim token-in nga header
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        res.status(401);
        throw new Error("Token not found");
      }

      // Verifikojmë token-in
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Marrim user-in pa password
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("User not found");
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }
});

module.exports = { protect };