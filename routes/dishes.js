const express = require("express");
const router = express.Router();
const { Dish, validate } = require("../models/dish");
const { Recipe, validateRecipe } = require("../models/recipe");
const auth = require("../middleware/auth");

function uniq(value, index, self) {
  return self.indexOf(value) === index;
}

router.get("/", async (req, res) => {
  let dishes = await Dish.find().select("-__v").sort("name");
  res.send(dishes);
});

router.get("/:id", async (req, res) => {
  const dish = await Dish.findById(req.params.id);
  const recipes = await Recipe.find({ dish: dish })
    .populate("dish")
    .populate("tags")
    .populate("book");
  // console.log(recipes);
  let tags = recipes.map((s) => s.tags[0]);
  tags = tags.map((t) => t).filter(uniq);
  // console.log(tags);
  res.send(tags);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(errors.details[0].message);

  let dish = new Dish({ name: req.body.name });
  dish = await dish.save();

  res.send(dish);
});

module.exports = router;
