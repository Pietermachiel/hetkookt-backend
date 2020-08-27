const express = require("express");
const router = express.Router();
const { Dish, validate } = require("../models/dish");
const { Recipe, validateRecipe } = require("../models/recipe");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const dishes = await Dish.find().select("-__v").sort("name");
  res.send(dishes);
});

router.get("/:id", async (req, res) => {
  const dish = await Dish.findById(req.params.id);
  const recipes = await Recipe.find({ dish: dish })
    .populate("dish")
    .populate("tags")
    .populate("book");
  console.log(recipes);
  res.send(recipes);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(errors.details[0].message);

  let dish = new Dish({ name: req.body.name });
  dish = await dish.save();

  res.send(dish);
});

module.exports = router;
