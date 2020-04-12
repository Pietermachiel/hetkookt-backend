const mongoose = require("mongoose");
// const express = require("express");
// const app = express();
const app = require("./app");
const config = require("config");

require("./startup/db")();

mongoose
  .connect(config.get("db"), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDB..."));

app.listen(
  5000,
  console.log(() => "Listening on port 5000")
);
