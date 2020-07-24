require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const error = require("./middleware/error");
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

// // manually

// // only works for synchronous code!
// process.on("uncaughtException", (ex) => {
//   console.log("WE GOT AN UNCOUGHT EXCEPTION");
//   winston.error(ex.message, ex);
// });

// // this works for asynchronous code...
// process.on("unhandledRejection", (ex) => {
//   console.log("WE GOT AN UNHANDLED REJECTION");
//   winston.error(ex.message, ex);
// });

// transports

winston.handleExceptions(
  new winston.transports.File({ filename: "uncaughtExeptions.log" })
);

process.on("unhandledRejection", (ex) => {
  throw ex;
});

winston.add(winston.transports.File, {
  filename: "logfile.log",
});
winston.add(winston.transports.MongoDB, {
  db: "mongodb://localhost/favorites",
  level: "error",
});

// // this represents the result of an asynchronous operation
// const p = Promise.reject(new Error("Something failed miserably"));
// p.then(() => console.log("Done")); // not calling .catch = unhandled rejection
// // throw new Error("Something failed during startup");

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

app.use(error); // not calling the function, this is just passing a reference to that function.

// app.use(function (err, req, res, next) {
//   // Log the exeption
//   // the exeption (ex) is the first argument of this function (err)
//   res.status(500).send("something failed");
// });

console.log("process.env");
console.log(process.env.EMAIL_USER);

const port = process.env.PORT || config.get("port");
const server = app.listen(port);

module.exports = server;
