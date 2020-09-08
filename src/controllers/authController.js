const User = require("../models/User");
const { validationResult } = require("express-validator");
const HTTPError = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");

const postAuthRegister = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new HTTPError(errors, 400);

    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) throw new HTTPError("This email already exist", 400);

    const raw = req.body;
    const newUser = new User(raw);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    if (error.custom)
      return res.status(error.status).json({ error: error.message });
    else res.status(500).json(error);
  }
};

const postAuthLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      throw new HTTPError(
        "The user that you are looking for does not exist",
        404
      );
    const match = await user.compare(password);
    if (!match) throw new HTTPError("The password is not correct", 400);

    const token = jwt.sign({ user }, process.env.JWT_SECRET || "secretKey");
    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    if (err.custom) return res.status(err.status).json({ error: err.message });
    res.status(500).json(err);
  }
};

const getAuthMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = {
  postAuthRegister,
  postAuthLogin,
  getAuthMe,
};
