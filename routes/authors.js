const express = require("express");
const router = express.Router();
const { Author } = require("../models/author");

router.get("/", async (req, res) => {
  const authors = await Author.find();
  res.send(authors);
});

router.post("/", async (req, res) => {
  let author = new Author({
    name: req.body.name,
  });

  author = await author.save();

  res.send(author);
});

module.exports = router;
