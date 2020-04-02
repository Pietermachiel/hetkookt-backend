const express = require("express");
const router = express.Router();
const { Recipe, validateRecipe } = require("../models/recipe");

router.get("/", async (req, res) => {
  const recipes = await Recipe.find();
  res.send(recipes);
});

router.get("/:id", async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  res.send(recipe);
});

router.post("/", async (req, res) => {
  const { error } = validateRecipe(req.body);
  //   console.log(error);
  if (error) return res.status(400).send(error.details[0].message);

  const recipe = new Recipe({
    title: req.body.title,
    dish: req.body.dish,
    author: req.body.author,
    tags: req.body.tags,
    fresh: req.body.fresh,
    stock: req.body.stock,
    directions: req.body.directions,
    basics: req.body.basics
  });
  await recipe.save();
  res.send(recipe);
});

router.put("/:id", async (req, res) => {
  const recipe = await Recipe.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      dish: req.body.dish,
      author: req.body.author,
      tags: req.body.tags,
      fresh: req.body.fresh,
      stock: req.body.stock,
      directions: req.body.directions,
      basics: req.body.basics
    },
    {
      new: true
    }
  );
  res.send(recipe);
});

module.exports = router;
