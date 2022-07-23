const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');

const getUser = asyncHandler(async (req, res) => {
  const keyword = req.params.Id
    ? {
        $or: [{ name: req.params.Id }, { email: req.params.Id }],
      }
    : {};

  console.log(keyword);

  const users = await User.find(keyword);
  res.send(users);
});

module.exports = {
  getUser,
};
