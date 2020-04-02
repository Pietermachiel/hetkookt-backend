const mongoose = require("mongoose");
// const express = require("express");
// const app = express();
const app = require("./app");

mongoose
  .connect("mongodb://127.0.0.1/mongoose", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log("Connected to MongoDB..."));

app.listen(
  5000,
  console.log(() => "Listening on port 5000")
);
