// const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  const db = config.get("db");
  const user = config.get("user");
  const password = config.get("password");
  const dbName = config.get("dbName");
  mongoose
    .connect(process.env.DB || db, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB..."));
  // .then(() => winston.info(`Connected to ${db}...`));
};
