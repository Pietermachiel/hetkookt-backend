const auth = require("../middleware/auth"); // authorisation (not authentication, validating password)
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const {
  User,
  validateUser,
  validateItems,
  validateGroceries,
} = require("../models/user");
const { validateRecipe } = require("../models/recipe");
var nodemailer = require("nodemailer");
var sgTransport = require("nodemailer-sendgrid-transport");
var mailtemplate = require("../mail/mailtemplate");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -__v");
  res.send(user);
});

router.get("/", auth, async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Deze gebruiker bestaat al.");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    temporarytoken: jwt.sign(
      {
        _id: req.body._id,
        name: req.body.name,
        email: req.body.email,
      },
      config.get("jwtPrivateKey"),
      {
        expiresIn: 12000,
      }
    ),
  });

  var options = {
    auth: {
      api_key: process.env.SENDGRID_PASSWORD,
    },
  };

  var client = nodemailer.createTransport(sgTransport(options));

  var email = {
    from: "studio@roozen.nl",
    to: user.email,
    subject: "Welkom bij hetKookt",
    text: "Welkom bij hetKookt",
    html: mailtemplate(user.name, user.temporarytoken),
  };

  console.log("the apikey");

  client.sendMail(email, function (err, info) {
    console.log("email");
    console.log(email);
    if (err) {
      // console.log("error");
      console.log(error);
    } else {
      // console.log("Message sent");
      console.log("Message sent: " + info.messageId);
    }
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken(); // = method user model

  res
    .header("x-auth-token", token)
    // add a header so the user can read a costum header
    // access-control-expose-headers= whitelist, x-auth-token= costum header
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "email", "active", "temporarytoken"]));
});

router.put("/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    {
      new: true,
    }
  );
  res.send(user);
});

// items

router.get("/items", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-__v");
  // .sort("title")
  // .populate("dish")
  // .populate("tags")
  // .populate("related");
  // console.log(user.items);
  const items = user.items;
  // console.log(user);
  // console.log(items);
  res.send(items);
});

router.put("/items/:id", async (req, res) => {
  // console.log("min");
  // const { error } = validateItems(req.body.items);
  // if (error) return res.status(400).send(error.details[0].message);
  console.log("plus");

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      items: req.body.items,
    },
    {
      new: true,
    }
  );
  res.send(user);
});

// groceries

router.get("/groceries", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-__v");
  // .sort("title")
  // .populate("dish")
  // .populate("tags")
  // .populate("related");
  // console.log(user.groceries);
  const groceries = user.groceries;
  // console.log(user);
  // console.log(groceries);
  res.send(groceries);
});

router.put("/groceries/:id", async (req, res) => {
  // const { error } = validateGroceries(req.body.groceries);
  // if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      groceries: req.body.groceries,
    },
    {
      new: true,
    }
  );
  console.log("plus");
  res.send(user);
});

router.put("/stock/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      stock: req.body.stock,
    },
    {
      new: true,
    }
  );
  // console.log("plus");
  res.send(user);
});

router.put("/extra/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      extra: req.body.extra,
    },
    {
      new: true,
    }
  );
  // console.log("plus extra");
  res.send(user);
});

// nothetkookt

router.get("/nothetkookt", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-__v");
  const nothetkookt = user.nothetkookt;
  res.send(nothetkookt);
});

router.put("/nothetkookt/:id", async (req, res) => {
  // const { error } = validatenothetkookt(req.body.nothetkookt);
  // if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      nothetkookt: req.body.nothetkookt,
    },
    {
      new: true,
    }
  );
  // console.log("plus");
  res.send(user);
});

// niethetkookt

router.get("/niethetkookt", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-__v");
  const niethetkookt = user.niethetkookt;
  res.send(niethetkookt);
});

router.put("/niethetkookt/:id", async (req, res) => {
  // const { error } = validateniethetkookt(req.body.niethetkookt);
  // if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      niethetkookt: req.body.niethetkookt,
    },
    {
      new: true,
    }
  );
  // console.log("plus");
  res.send(user);
});

// Route to activate the user's account
router.put("/verify/:token", (req, res) => {
  User.findOne({ temporarytoken: req.params.token }, (err, user) => {
    if (err) throw err; // Throw error if cannot login
    const token = req.params.token; // Save the token from URL for verification
    console.log("Verified token:", token);
    // Function to verify the user's token
    // console.log(user);
    jwt.verify(token, config.get("jwtPrivateKey"));
    // user.temporarytoken = false; // Remove temporary token
    user.active = true; // Change account status to Activated
    // Mongoose Method to save user into the database
    user.save();
    // console.log(user);
  });
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  res.send(user);
});

module.exports = router;
