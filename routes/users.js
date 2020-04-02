const auth = require("../middleware/auth"); // authorisation (not authentication, validating password)
const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/user");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id)
    // .populate("recipes", "title author basics tags isOpen dish, recipes")
    .select("-password -__v");
  res.send(user);
});

router.get("/", async (req, res) => {
  const users = await User.find()
    .populate("recipes", "title author")
    .select("-__v -password -email")
    .sort("name");
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password", "favorites"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  console.log(user);
  res.send(user);
  // const token = user.generateAuthToken(); // = method user model
  // res
  //   .header("x-auth-token", token)
  //   // add a header so the user can read a costum header
  //   // access-control-expose-headers= whitelist, x-auth-token= costum header
  //   .header("access-control-expose-headers", "x-auth-token")
  //   .send(_.pick(user, ["_id", "name", "email", "favorites"]));
});

router.put("/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name
    },
    {
      new: true
    }
  );
  res.send(user);
});

router.put("/favorites/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      recipes: req.body.recipes
    },
    {
      new: true
    }
  );
  console.log("plus");
  res.send(user);
});

router.put("/favminus/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      recipes: req.body.recipes
    },
    {
      new: true
    }
  );
  console.log("minus");
  res.send(user);
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  res.send(user);
});

module.exports = router;
