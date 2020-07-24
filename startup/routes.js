const express = require("express");
const users = require("../routes/users");
const genres = require("../routes/genres");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/auth", auth);
  app.use("/api/users", users);
  app.use("/api/genres", genres);
  app.use(error);
};
