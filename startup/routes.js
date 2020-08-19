const express = require("express");
const users = require("../routes/users");
const recipes = require("../routes/recipes");
const books = require("../routes/books");
const kitchens = require("../routes/kitchens");
const tags = require("../routes/tags");
const categories = require("../routes/categories");
const dishes = require("../routes/dishes");
const authors = require("../routes/authors");
const stories = require("../routes/stories");
const auth = require("../routes/auth");
// const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/auth", auth);
  app.use("/api/users", users);
  app.use("/api/recipes", recipes);
  app.use("/api/books", books);
  app.use("/api/kitchens", kitchens);
  app.use("/api/tags", tags);
  app.use("/api/categories", categories);
  app.use("/api/dishes", dishes);
  app.use("/api/authors", authors);
  app.use("/api/stories", stories);
  // app.use(error);
};
