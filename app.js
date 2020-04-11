const cors = require("cors");
const express = require("express");
const app = express();
const users = require("./routes/users");
const auth = require("./routes/auth");
const recipes = require("./routes/recipes");
app.use(express.json());
app.use(cors());

app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/recipes", recipes);
app.use(cors());

module.exports = app;
