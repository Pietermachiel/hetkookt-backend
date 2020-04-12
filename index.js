const mongoose = require("mongoose");
// const express = require("express");
// const app = express();
const app = require("./app");

require("./startup/db")();

mongoose
  .connect(
    "mongodb+srv://Pietermachiel:pieter19machiel54lambert@cluster0-npjfk.mongodb.net/favorites",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("Connected to MongoDB..."));

app.listen(
  5000,
  console.log(() => "Listening on port 5000")
);
