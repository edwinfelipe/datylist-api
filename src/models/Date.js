const mongoose = require("mongoose");
const { Schema } = mongoose;

const DateSchema = new Schema({
  stylist: { type: Schema.Types.ObjectId, required: true },
  client: { type: Schema.Types.ObjectId, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Date", DateSchema);
