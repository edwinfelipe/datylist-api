const express = require("express");
const routes = require("./routes");
const createServer = () => {
  const app = express();

  app.set("port", process.env.PORT || 5000);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(routes);

  return app;
};

module.exports = createServer;
