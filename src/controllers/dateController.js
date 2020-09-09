const DateModel = require("../models/Date");
const HTTPError = require("../utils/errorHandler");
const postDate = async (req, res) => {
  try {
    const raw = req.body;
    const stylistId = req.params.id;
    const { _id } = req.user;
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
};
