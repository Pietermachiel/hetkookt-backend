// const winston = require("winston");
// const error = require("./middleware/error");
const express = require("express");
const config = require("config");
const app = express();
const rateLimit = require("express-rate-limit"); // Preventing DOS Attacks
const xss = require("xss-clean"); // Preventing XSS Attacks
const helmet = require("helmet"); // Preventing XSS Attacks
const mongoSanitize = require("express-mongo-sanitize"); //Preventing NoSQL Injection Attacks

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

require("./startup/validation")();
// require("./startup/logging")();
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();

app.use(xss()); // Data Sanitization against XSS
app.use(helmet()); // make sure cookies for JWT storing are HTTP Only!
app.use(express.json({ limit: "10kb" })); // Body limit is 10
app.use(mongoSanitize());
const limit = rateLimit({
  // preventing DOS attacks
  max: 5, // max requests
  windowMs: 60 * 60 * 24000, // 24 Hour
  message: "Too many requests", // message to send
});
app.use("/login", limit); // Setting limiter on specific route

// app.use(error); // not calling the function, this is just passing a reference to that function.

console.log("process.env");
console.log(process.env.EMAIL_USER);

const port = process.env.PORT || config.get("port");
const server = app.listen(port);
// const server = app.listen(port, () =>
//   winston.info(`Listening on port ${port}...`)
// );

module.exports = server;
