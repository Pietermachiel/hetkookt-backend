const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Book, validate } = require("../models/book");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const books = await Book.find()
    .sort({ year: -1 })
    .populate("kitchen", "name");
  res.send(books);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let book = new Book({
    name: req.body.name,
    kitchen: req.body.kitchen,
    author: req.body.author,
    publisher: req.body.publisher,
    source: req.body.source,
    year: req.body.year,
    kitchen: req.body.kitchen,
    text: req.body.text,
  });
  book = await book.save();

  res.send(book);
});

router.put("/:id", [auth, validateObjectId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const book = await Book.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      kitchen: req.body.kitchen,
      author: req.body.author,
      publisher: req.body.publisher,
      source: req.body.source,
      year: req.body.year,
      kitchen: req.body.kitchen,
      text: req.body.text,
    },
    {
      new: true,
    }
  );

  if (!book)
    return res.status(404).send("The book with the given ID was not found.");

  res.send(book);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const book = await Book.findByIdAndRemove(req.params.id);

  if (!book)
    return res.status(404).send("The book with the given ID was not found.");

  res.send(book);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const book = await await Book.findById(req.params.id)
    .select("-__v")
    .sort("year")
    .populate("kitchen");

  if (!book)
    return res.status(404).send("The book with the given ID was not found.");

  res.send(book);
});

module.exports = router;
