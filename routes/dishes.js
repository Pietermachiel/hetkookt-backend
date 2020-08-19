const express = require("express");
const router = express.Router();
const { Dish, validate } = require("../models/dish");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const dishes = await Dish.find().select("-__v").sort("name");
  res.send(dishes);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(errors.details[0].message);

  let dish = new Dish({ name: req.body.name });
  dish = await dish.save();

  res.send(dish);
});

module.exports = router;
