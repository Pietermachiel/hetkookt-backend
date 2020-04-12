const cors = require("cors");
const express = require("express");
const app = express();
const users = require("./routes/users");
const auth = require("./routes/auth");
const recipes = require("./routes/recipes");
const rateLimit = require("express-rate-limit"); // Preventing DOS Attacks
const xss = require("xss-clean"); // Preventing XSS Attacks
const helmet = require("helmet"); // Preventing XSS Attacks
const mongoSanitaize = require("express-mongo-sanitize"); //Preventing NoSQL Injection Attacks
const config = require("config");

app.use(express.json());
app.use(cors());

app.use(express.json({ limit: "10kb" })); // build in middleware function
app.use(express.urlencoded({ extended: true })); // key=value&key=value

app.use(xss()); // Data Sanitization against XSS
app.use(helmet()); // make sure cookies for JWT storing are HTTP Only!
app.use(mongoSanitaize());
const limit = rateLimit({
  // preventing DOS attacks
  max: 5, // max requests
  windowMs: 60 * 60 * 24000, // 24 Hour
  message: "Too many requests", // message to send
});
app.use("/login", limit); // Setting limiter on specific route

app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/recipes", recipes);

console.log("Database: " + config.get("db"));

module.exports = app;
