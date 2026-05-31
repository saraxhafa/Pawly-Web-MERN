const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getCurrentUser
} = require("../controllers/userController");

const { protect } = require("../middlewares/authMiddlewares"); // kujdes path

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", protect, getCurrentUser);

module.exports = router;