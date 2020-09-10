const HTTPError = require("../utils/errorHandler");
const DateModel = require("../models/Date");
const User = require("../models/User");

const postDate = async (req, res) => {
  try {
    const raw = req.body;
    const stylistId = req.params.id;
    const { _id } = req.user;

    const stylist = await User.findById(stylistId);

    if (stylist.rol == "client")
      throw new HTTPError("You only can reserve sites with stylists", 400);
      
    const stylistDates = await DateModel.find({
      stylist: stylistId,
      date: {
        $lte: add30MinutesToDate(raw.date),
        $gte: substract30MinutesToDate(raw.date),
      },
    });

    if (stylistDates.length > 0)
      throw new HTTPError(
        "This stylist has dates at this time please adjust the date time",
        400
      );
    const date = new DateModel({
      date: raw.date,
      client: _id,
      stylist: stylistId,
    });
    await date.save();
    res.status(201).json(date);
  } catch (err) {
    console.log(err);
    if (err.custom) return res.status(err.status).json({ error: err.message });
    res.status(500).json(err);
  }
};

const getDates = async (req, res) => {
  try {
    const id = req.params.id;
    const stylist = await User.findById(id);
    if (stylist.rol === "client" && id != req.user._id)
      throw new HTTPError(
        "Only the stylist dates and your own are public, you cant perform this action",
        403
      );

    const dates = await DateModel.find();
    res.status(200).json(dates);
  } catch (err) {
    console.log(err);
    if (err.custom) return res.status(err.status).json({ error: err.message });
    res.status(500).json({ err });
  }
};
const add30MinutesToDate = (dateString) => {
  const date = new Date(dateString);
  let time = date.getTime();
  const miliseconds = 30 * 60 * 1000;
  time += miliseconds;
  return new Date(time);
};

const substract30MinutesToDate = (dateString) => {
  const date = new Date(dateString);
  let time = date.getTime();
  const miliseconds = 30 * 60 * 1000;
  time -= miliseconds;
  return new Date(time);
};

module.exports = {
  postDate,
  getDates,
};
