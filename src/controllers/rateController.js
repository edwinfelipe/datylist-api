const Rate = require("../models/Rate");
const User = require("../models/User");
const HTTPError = require("../utils/errorHandler");
const getRates = async (req, res) => {
  try {
    const rates = await Rate.find();
    res.status(200).json(rates);
  } catch (err) {
    console.log(err);
    if (err instanceof HTTPError)
      return res.status(err.status).json({ error: err.message });
    res.status(500).json(err);
  }
};

const postRate = async (req, res) => {
  try {
    const stylistId = req.params.id;
    const sameRates = await Rate.findOne({
      client: req.user._id,
      stylist: stylistId,
    });
    const stylist = await User.findOne({ _id: stylistId });
    if (req.body.rate > 5 || req.body.rate <= 0)
      throw new HTTPError("The rating must be between 1 and 5", 400);
    if (sameRates)
      throw new HTTPError(
        "This client already has a rate for this stylist",
        400
      );
    if (!stylist)
      throw new HTTPError(
        "The stylsit you are looking for does not exist",
        404
      );

    const newRate = new Rate({
      stylist: stylistId,
      client: req.user._id,
      rate: req.body.rate,
      comment: req.body.comment,
    });
    await newRate.save();
    res.status(201).json(newRate);
  } catch (err) {
    console.log(err);
    if (err instanceof HTTPError)
      return res.status(err.status).json({ error: err.message });
    res.status(500).json(err);
  }
};

const putRate = async (req, res) => {
  try {
    const rateId = req.params.id;
    const stylistId = req.params.uid;

    const stylist = await User.findOne({ _id: stylistId });
    const rate = await Rate.findOne({ _id: rateId });
    if (!stylist || !rate)
      throw new HTTPError(
        "The user or rate you are looking for does not exist",
        404
      );
    if (req.body.rate <= 0 || req.body.rate > 5)
      throw new HTTPError("The rate must be between 1 and 5", 400);
    if (rate.client != req.user._id)
      throw new HTTPError("This rate is not from your own", 403);

    const updatedRate = await Rate.findByIdAndUpdate(
      rateId,
      {
        rate: req.body.rate,
        comment: req.body.comment,
      },
      { new: true }
    );
    res.status(200).json(updatedRate);
  } catch (err) {
    console.log(err);
    if (err instanceof HTTPError)
      return res.status(err.status).json({ error: err.message });
    res.status(500).json(err);
  }
};

const deleteRate = async (req, res) => {
  try {
    const rateId = req.params.id;
    const stylistId = req.params.uid;

    const stylist = await User.findOne({ _id: stylistId });
    const rate = await Rate.findOne({ _id: rateId });

    if (!stylist || !rate)
      throw new HTTPError(
        "The user or rate you are looking for does not exist",
        404
      );

    await Rate.findByIdAndDelete(rateId);
    res.status(200).json({ status: "Success" });
  } catch (err) {
    console.log(err);
    if (err instanceof HTTPError)
      return res.status(err.status).json({ error: err.message });
    res.status(500).json(err);
  }
};

module.exports = {
  getRates,
  postRate,
  putRate,
  deleteRate,
};
