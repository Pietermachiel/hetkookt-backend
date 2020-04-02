const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  if (!config.get("requiresAuth")) return next();

  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");
  // return = exit the function

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next(); // route handler (anders kan ', auth,' niet voor route argument)
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};
