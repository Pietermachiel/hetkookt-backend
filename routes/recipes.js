const { Recipe, validate } = require("../models/recipe");
const { Tag } = require("../models/tag");
const { Category } = require("../models/category");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  // const bookquery = req.query.book;
  // const recipes = await Recipe.find({ book: bookquery })
  const recipes = await Recipe.find()
    .select("-__v")
    .sort("title")
    .populate({ path: "book", populate: { path: "kitchen" } });
  // .populate({ path: "book tag", populate: { path: "kitchen category" } });
  res.send(recipes);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  console.log(req.body);

  // const tag = await Tag.findById(req.body.tag);
  // if (!tag) return res.status(400).send("Invalid tag.");

  // console.log("tag");
  // console.log(tag);

  // const category = await Category.findById(tag.category);
  // if (!category) return res.status(400).send("Invalid category");

  // console.log("category");
  // console.log(category);

  const recipe = new Recipe({
    title: req.body.title,
    book: req.body.book,
    // tag: req.body.tag,
    tag: req.body.tag,
  });

  await recipe.save();

  res.send(recipe);
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const book = await Book.findById(req.body.bookId);
  if (!book) return res.status(400).send("Invalid book.");

  const recipe = await Recipe.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      book: {
        _id: book._id,
        title: book.title,
      },
    },
    { new: true }
  );

  if (!recipe)
    return res.status(404).send("The recipe with the given ID was not found.");

  res.send(recipe);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const recipe = await Recipe.findByIdAndRemove(req.params.id);

  if (!recipe)
    return res.status(404).send("The recipe with the given ID was not found.");

  res.send(recipe);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).select("-__v");

  if (!recipe)
    return res.status(404).send("The recipe with the given ID was not found.");

  res.send(recipe);
});

module.exports = router;
