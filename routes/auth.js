const express = require("express");
const { body } = require("express-validator");
const User = require("../models/user");
const authController = require("../controllers/auth");

const router = express.Router();

router.post("/signup", [
  body("email")
    .isEmail()
    .withMessage("invalid email")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("email existed");
        }
      });
    }),
  body("password").isLength({ min: 5 }).withMessage("password too short"),
]);

router.post("/login", authController.login);

module.exports = router;
