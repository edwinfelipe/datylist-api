const createServer = require("./server");
const connectToDb = require("./db");
const app = createServer();

connectToDb()
  .then(() => {
    app.listen(app.get("port"), () => {
      console.log(`Server running on port ${app.get("port")}`);
    });
    console.log("Db is connected");
  })
  .catch((err) => console.log(err));
