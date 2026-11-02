
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("../models/userModel");
const Order = require("../models/orderModel");

// ======================
// JWT TOKEN
// ======================
const generateJWTToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

// ======================
// REGISTER USER
// ======================
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      message: "Please fill in all fields.",
    });
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof confirmPassword !== "string"
  ) {
    return res.status(400).json({
      message: "Invalid user data.",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      message: "Passwords do not match.",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must contain at least 8 characters.",
    });
  }

  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!normalizedName || !emailRegex.test(normalizedEmail)) {
    return res.status(400).json({
      message: "Please enter a valid name and email.",
    });
  }

  const userExists = await User.findOne({
    email: normalizedEmail,
  });

  if (userExists) {
    return res.status(409).json({
      message: "User already exists.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: normalizedName,
    email: normalizedEmail,
    password: hashedPassword,
  });

  return res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email,
    token: generateJWTToken(user._id),
  });
});

// ======================
// LOGIN USER
// ======================
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      message: "Please provide email and password.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials.",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid credentials.",
    });
  }

  return res.status(200).json({
    id: user._id,
    name: user.name,
    email: user.email,
    token: generateJWTToken(user._id),
  });
});

// ======================
// CURRENT USER
// ======================
const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;

  if (!userId) {
    return res.status(401).json({
      message: "User authentication required.",
    });
  }

  const user = await User.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  return res.status(200).json(user);
});

// ======================
// LOGOUT USER
// ======================
const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;

  if (!userId) {
    return res.status(401).json({
      message: "User authentication required.",
    });
  }

  return res.status(200).json({
    message: "Logged out successfully.",
  });
});

// ======================
// DELETE ACCOUNT (SOFT DELETE)
// ======================
const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;

  if (!userId) {
    return res.status(401).json({
      message: "User authentication required.",
    });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  // This function is retained for a possible
  // future soft-delete workflow.
  user.status = "deleted";
  user.accountDeletedReason =
    req.body?.reason || "No reason provided";

  await user.save();

  return res.status(200).json({
    message: "Account deactivated successfully.",
  });
});

// ======================
// UPDATE PROFILE
// ======================
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized. Please log in again.",
    });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  const { name, email, password, confirmPassword } = req.body;

  // UPDATE NAME
  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Name cannot be empty.",
      });
    }

    user.name = name.trim();
  }

  // UPDATE EMAIL
  if (email !== undefined) {
    if (typeof email !== "string") {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: user._id },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "This email is already registered.",
      });
    }

    user.email = normalizedEmail;
  }

  // UPDATE PASSWORD (OPTIONAL)
  if (password !== undefined || confirmPassword !== undefined) {
    if (
      typeof password !== "string" ||
      typeof confirmPassword !== "string" ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "Please enter and confirm your new password.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters.",
      });
    }

    user.password = await bcrypt.hash(password, 10);
  }

  try {
    const updatedUser = await user.save();

    return res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: generateJWTToken(updatedUser._id),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This email is already registered.",
      });
    }

    throw error;
  }
});

// ======================
// DELETE PROFILE (PERMANENT)
// ======================
const deleteProfile = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const { password } = req.body || {};

  // CHECK AUTHENTICATION
  if (!userId) {
    return res.status(401).json({
      message: "User authentication required.",
    });
  }

  // CHECK PASSWORD
  if (typeof password !== "string" || !password) {
    return res.status(400).json({
      message: "Please enter your current password.",
    });
  }

  // FIND USER
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  // VERIFY CURRENT PASSWORD
  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Incorrect password. Profile deletion cancelled.",
    });
  }

  let session;

  try {
    session = await mongoose.startSession();

    await session.withTransaction(async () => {
      // ANONYMIZE HISTORICAL ORDERS
      await Order.updateMany(
        { user: userId },
        {
          $set: {
            customerSnapshot: {
              name: "Deleted User",
              email: `deleted-${userId}@example.invalid`,
            },
          },
        },
        { session }
      );

      // PERMANENTLY DELETE USER
      await User.findByIdAndDelete(userId).session(session);
    });

    return res.status(200).json({
      message: "Your profile has been successfully deleted.",
    });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
});

// ======================
// EXPORT CONTROLLERS
// ======================
module.exports = {
  registerUser,
  loginUser,
  updateProfile,
  getCurrentUser,
  logoutUser,
  deleteAccount,
  deleteProfile,
};
