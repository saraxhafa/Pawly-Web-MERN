const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// JWT TOKEN
const generateJWTToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });


// ======================
// REGISTER USER
// ======================
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // validation
  if (!name || !email || !password || !confirmPassword) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error("Passwords do not match");
  }

  // check existing user
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    status: "active",
    lastLogin: new Date(),
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid user data");
  }

  res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email,
    status: user.status,
    token: generateJWTToken(user._id),
  });
});


// ======================
// LOGIN USER
// ======================
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(400);
    throw new Error("Invalid credentials");
  }

  // update login info
  user.status = "active";
  user.lastLogin = new Date();
  await user.save();

  res.status(200).json({
    id: user._id,
    name: user.name,
    email: user.email,
    status: user.status,
    token: generateJWTToken(user._id),
  });
});


// ======================
// CURRENT USER
// ======================
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});


// ======================
// LOGOUT USER
// ======================
const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.status = "inactive";
  await user.save();

  res.status(200).json({
    message: "Logged out successfully",
  });
});


// ======================
// DELETE ACCOUNT (SOFT DELETE)
// ======================
const deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.status = "deleted";
  user.accountDeletedReason = req.body.reason || "No reason provided";

  await user.save();

  res.status(200).json({
    message: "Account deleted successfully",
  });
});




const updateProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    token: generateToken(updatedUser._id),
  });
};








const deleteProfile = async (
  req,
  res
) => {
  const user = await User.findById(
    req.user.id
  );

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  await User.findByIdAndDelete(
    req.user.id
  );

  res.json({
    message:
      "Account deleted successfully",
  });
};







module.exports = {
  registerUser,
  loginUser,
  updateProfile,
  getCurrentUser,
  logoutUser,
  deleteProfile,
  updateProfile,
};