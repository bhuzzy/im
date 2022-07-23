const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const mongoose = require('mongoose');

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

  // hash password

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    pubId,
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

// GET USER WITH USERNAME, PUBID, OR _ID

const getUser = asyncHandler(async (req, res) => {
  const keyword = req.params.id
    ? {
        $or: [{ username: req.params.id }, { pubId: req.params.id }],
      }
    : {};

  let users = await User.find(keyword);

  if (users.length === 0 && mongoose.Types.ObjectId.isValid(req.params.id)) {
    try {
      users = await User.find({ _id: req.params.id });
    } catch (err) {
      console.log(err);
      users = [];
    }
  }

  res.send(users);
});

// doesn't check if signed in.

const findUsers = asyncHandler(async (req, res) => {
  // const keyword = req.params.searchWord
  //   ? {
  //       $or: [{ name: { $regex: req.params.searchWord, $options: 'i' } }],
  //     }
  //   : {};

  // const users = await User.find(keyword);

  const users = await User.find(
    {
      $or: [{ name: { $regex: req.params.searchWord, $options: 'i' } }],
    },
    { name: 1, pubId: 1, username: 1 }
  );

  res.send(users);
});

const checkPub = asyncHandler(async (req, res) => {
  const pub = await User.find({ pubId: req.params.pubId });
  res.send(pub);
});

const updateUsername = asyncHandler(async (req, res) => {
  // const usernamea = await User.findByIdAndUpdate(
  //   { _id: req.user.id },
  //   { $set: { email: req.body.username } },
  //   { upsert: true }
  // );

  const username = await User.updateOne(
    { _id: req.user._id },
    { $set: { username: req.body.username } },
    { upsert: true }
  );

  res.send(username);
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  findUsers,
  checkPub,
  updateUsername,
  getUser,
};
