const User = require("../models/User");
const HTTPError = require("../utils/errorHandler");
const { validationResult } = require("express-validator");
const putUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new HTTPError(errors, 400);

    const { name, lastName } = req.body;
    const newUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, lastName },
      { new: true }
    );
    res.status(200).json(newUser);
  } catch (err) {
    if (err instanceof HTTPError)
      return res.status(err.status).json({ error: err.message });
    res.status(500).json(err);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ rol: "stylist" });
    res.status(200).json(users);
  } catch (err) {
    if (err instanceof HTTPError)
      return res.status(err.status).json({ error: err.message });
    res.status(500).json(err);
  }
};
module.exports = {
  putUser,
  getUsers,
};
