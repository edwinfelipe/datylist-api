const { check } = require("express-validator");

const registerValidation = [
  check("name").isLength({ min: 2, max: 20 }),
  check("lastName").isLength({ min: 2, max: 20 }),
  check("email").isEmail(),
  check("password").isLength({ min: 8 }),
];

const userUpdateValidation = [
  check("name").isLength({ min: 2, max: 20 }),
  check("lastName").isLength({ min: 2, max: 20 }),
];

module.exports = { registerValidation, userUpdateValidation };
