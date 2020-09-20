const { Recipe, validateRecipe } = require("../models/recipe");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  // const titlequery = req.query.title;
  // console.log(titlequery);
  // const recipes = await Recipe.find({ title: titlequery })
  const recipes = await Recipe.find()
    .select("-__v")
    .sort("title")
    .populate("dish")
    .populate("tags")
    .populate("book")
    .populate("related");
  res.send(recipes);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validateRecipe(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  console.log("post recipe");
  console.log(req.body);

  const recipe = new Recipe({
    title: req.body.title,
    dish: req.body.dish,
    tags: req.body.tags,
    book: req.body.book,
    related: req.body.related,
    fresh: req.body.fresh,
    stock: req.body.stock,
    directions: req.body.directions,
    info: req.body.info,
    date: req.body.date,
  });

  await recipe.save();

  res.send(recipe);
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validateRecipe(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  console.log("put recipe");
  console.log(req.body);

  const recipe = await Recipe.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      dish: req.body.dish,
      tags: req.body.tags,
      book: req.body.book,
      related: req.body.related,
      fresh: req.body.fresh,
      stock: req.body.stock,
      directions: req.body.directions,
      info: req.body.info,
      date: req.body.date,
    },
    { new: true }
  );

  if (!recipe)
    return res.status(404).send("The recipe with the given ID was not found.");

  res.send(recipe);
});

router.delete("/:id", [auth], async (req, res) => {
  const recipe = await Recipe.findByIdAndRemove(req.params.id);

  if (!recipe)
    return res.status(404).send("The recipe with the given ID was not found.");

  res.send(recipe);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const recipe = await Recipe.findById(req.params.id)
    .select("-__v")
    .sort("title")
    .populate("dish")
    .populate("tags")
    .populate("book")
    .populate("related");

  if (!recipe)
    return res.status(404).send("The recipe with the given ID was not found.");

  res.send(recipe);
});

module.exports = router;
