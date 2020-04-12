// const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect(
      "mongodb+srv://Pietermachiel:pieter19machiel54lambert@cluster0-npjfk.mongodb.net/favorites?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => console.log("Connected to MongoDB..."));
  // .then(() => winston.info(`Connected to ${db}...`));
};
