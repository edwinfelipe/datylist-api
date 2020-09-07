const createServer = require("./server");

const app = createServer();

app.listen(app.get("port"), () => {
  console.log(`Server running on port ${app.get("port")}`);
});
