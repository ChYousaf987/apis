// middleware/authMiddleware
const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const authHandler = asyncHandler(async (req, res, next) => {
  let token;

  console.log("Authorization header:", req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      let decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decode);

      req.user = await userModel.findById(decode.id);
      if (!req.user) {
        res.status(401);
        throw new Error("User not found");
      }
      console.log("Authenticated user:", req.user);
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(401);
      throw new Error("Invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Token not found");
  }
});

module.exports = authHandler;