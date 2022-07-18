const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pubId } = req.body;

  // validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please include all fields');
  }

  // find if user already exists
  const userExists = await User.findOne({ email });

  // find if user already exists
  const pubIdExists = await User.findOne({ pubId });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  if (pubIdExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const pubId2 = nanoid();
  console.log(pubIb2);

  // hash password

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    pubId,
    pubId2,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new error('Invalid user data');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid crediantials');
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// GET ME

const getMe = asyncHandler(async (req, res) => {
  res.send('me');
});

// checks if signed in

const getUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

// doesn't check if signed in.

const findUsers = asyncHandler(async (req, res) => {
  const keyword = req.params.searchWord
    ? {
        $or: [{ name: { $regex: req.params.searchWord, $options: 'i' } }],
      }
    : {};

  const users = await User.find(keyword);

  res.send(users);
});

const checkPub = asyncHandler(async (req, res) => {
  const pub = await User.find({ pubId: req.params.pubId });
  res.send(pub);
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  findUsers,
  checkPub,
};
