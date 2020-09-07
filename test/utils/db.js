const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

const mongod = new MongoMemoryServer();

const connectToTestDb = async () => {
  const uri = await mongod.getUri();
  await mongoose.connect(uri);
  
  mongoose.connection.once("open", () => {
    console.log(`MongoDB successfully connected to ${uri}`);
  });
  return mongoose;
};

const dropDatabase = (done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
};
module.exports = { connectToTestDb, dropDatabase };
