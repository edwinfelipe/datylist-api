const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true, select: false },
});

UserSchema.pre("save", async function () {
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    console.log(err);
  }
});

UserSchema.method("toJSON", function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
});
UserSchema.method("compare", async function (password) {
  return await bcrypt.compare(password, this.password);
});

module.exports = mongoose.model("User", UserSchema);
