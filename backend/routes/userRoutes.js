const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  deleteProfile,
  updateProfile,
} = require("../controllers/userController");

const { protect } = require("../middlewares/authMiddlewares"); // FIX: emri korrekt

// PUBLIC ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);

// PROTECTED ROUTES
router.get("/current", protect, getCurrentUser);
router.post("/logout", protect, logoutUser);
router.put("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteProfile);

module.exports = router;