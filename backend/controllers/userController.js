
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// JWT function
const generateJWTToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      token: generateJWTToken(user._id),
    });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(400);
    throw new Error('Invalid credentials');
  }

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    token: generateJWTToken(user._id),
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const { _id, name, email } = await User.findById(req.user.id)
  res.status(200).json({ id: _id, name, email })

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    message: "Current User Data",
  });
});

module.exports = { registerUser, loginUser, getCurrentUser };