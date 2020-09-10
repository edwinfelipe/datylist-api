const mongoose = require("mongoose");
const { Schema } = mongoose;

const RateSchema = new Schema({
  client: { type: Schema.Types.ObjectId, required: true },
  stylist: { type: Schema.Types.ObjectId, required: true },
  rate: { type: Number, required: true },
  comment: { type: String },
});

module.exports = mongoose.model("Rate", RateSchema);
