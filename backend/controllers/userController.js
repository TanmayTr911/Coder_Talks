const asyncHandler = require("express-async-handler");
const User = require("../models/usermod");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");

const regUser = asyncHandler(async (req, res) => {
  const { name, email, pass, pic } = req.body;

  if (!name || !email || !pass) {
    res.send({
      err: "error",
    });
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("ENter ALl Fields");

    // console.log("user exist");
    return;
  }

  const user = await User.create({
    name,
    email,
    pass,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Unable to craete user");
  }
});

const logUser = async (req, res) => {
  const { email, pass } = req.body;

  if (!email || !pass) {
    res.status(400);
    throw new Error("Please Enter All The Details");
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(pass))) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    // console.log("wrong useraname / pass");
    res.status(400).send({
      err: "Wrong PAss",
    });
  }
};

const allUser = asyncHandler(async (req, res) => {
  const keyw = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  // console.log(req.user._id);
  // const user = await User.find(keyw);

  const users = await User.find(keyw);

  res.send(users);
});

module.exports = { regUser, logUser, allUser };
