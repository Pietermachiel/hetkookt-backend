const express = require("express");
const users = require("../routes/users");
const auth = require("../routes/auth");
const recipes = require("../routes/recipes");
const item = require("../routes/item");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/auth", auth);
  app.use("/api/users", users);
  app.use("/api/recipes", recipes);
  app.use("/api/", item);
};
