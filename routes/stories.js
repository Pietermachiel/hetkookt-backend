const express = require("express");
const { Story, validateStory } = require("../models/story");
const router = express.Router();

router.get("/", async (req, res) => {
  const stories = await Story.find();

  res.send(stories);
});

router.post("/", async (req, res) => {
  // const { error } = validateStory(req.body);
  // if (error) return res.status(400).send(errors.details[0].message);

  let story = new Story({
    title: req.body.title,
    author: req.body.author,
  });

  story = await story.save();

  res.send(story);
});

module.exports = router;
