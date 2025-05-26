// controller/usercontroller
const handler = require("express-async-handler");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = handler(async (req, res) => {
  // get the data from the frontend
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  // check if the email already exists
  const findUser = await userModel.findOne({ email });

  if (findUser) {
    res.status(401);
    throw new Error("Email already exists!");
  }

  // hash the password
  const hashedPass = await bcrypt.hash(password, 10);
  // add the data into the database
  const createdUser = await userModel.create({
    username,
    email,
    password: hashedPass,
  });

  res.send({
    _id: createdUser._id,
    username: createdUser.username,
    email: createdUser.email,
    password: createdUser.password,
    token: generateToken(createdUser._id),
  });
});

const loginUser = handler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  const findUser = await userModel.findOne({ email });

  if (!findUser) {
    res.status(404);
    throw new Error("Invalid Email");
  }

  if (findUser && (await bcrypt.compare(password, findUser.password))) {
    res.send({
      _id: findUser._id,
      username: findUser.username,
      email: findUser.email,
      password: findUser.password,
      role: findUser.role,
      token: generateToken(findUser._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid password");
  }
});

// generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

module.exports = {
  registerUser,
  loginUser,
};
