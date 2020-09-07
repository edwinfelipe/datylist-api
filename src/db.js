const mongoose = require("mongoose");

const connectToDb = (uri) => {
  return mongoose.connect(
    uri || process.env.PORT || "mongodb://localhost:27017/datylist",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  );
};

module.exports = connectToDb;
