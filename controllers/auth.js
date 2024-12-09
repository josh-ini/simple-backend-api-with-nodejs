const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.signup = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const error = new Error("validation failed");
    error.data = error.array();
    error.statusCode = 500;
    throw error;
  }
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        name: name,
      });
      return user.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "User created successfully!",
        userId: result._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let foundUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!foundUser) {
        const error = new Error("User with this email not found");
        error.statusCode = 500;
        throw error;
      }
      foundUser = user;
      return bcrypt.compare(password, user.password).then((result) => {
        if (!result) {
          const error = new Error("User with this email not found");
          error.statusCode = 500;
          throw error;
        }
        jwt.sign(
          { email: foundUser.email, userId: foundUser._id },
          process.env.JwtSecret,
          { expiresIn: "1hr" }
        );
          res.status(200).json({
            message: "User logged in successfully!",
            userId: foundUser._id.toString(),
            email: foundUser.email
          });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
