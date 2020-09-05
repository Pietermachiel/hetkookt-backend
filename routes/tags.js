const { Tag, validateTag } = require("../models/tag");
const { Category } = require("../models/category");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const moment = require("moment");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const tags = await Tag.find()
    .select("-__v")
    .sort("name")
    .populate("category");
  res.send(tags);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validateTag(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // const category = await Category.findById(req.body.categoryId);
  // if (!category) return res.status(400).send("Invalid category.");

  const tag = new Tag({
    name: req.body.name,
    category: req.body.category,
    // category: {
    //   _id: category._id,
    //   name: category.name,
    // },
    // numberInStock: req.body.numberInStock,
    // // dailyRentalRate: req.body.dailyRentalRate,
    // publishDate: moment().toJSON(),
  });
  await tag.save();

  res.send(tag);
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validateTag(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.categoryId);
  if (!category) return res.status(400).send("Invalid category.");

  const tag = await Tag.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      category: {
        _id: category._id,
        name: category.name,
      },
      numberInStock: req.body.numberInStock,
      // dailyRentalRate: req.body.dailyRentalRate
    },
    { new: true }
  );

  if (!tag)
    return res.status(404).send("The tag with the given ID was not found.");

  res.send(tag);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const tag = await Tag.findByIdAndRemove(req.params.id);

  if (!tag)
    return res.status(404).send("The tag with the given ID was not found.");

  res.send(tag);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const tag = await Tag.findById(req.params.id).select("-__v");

  if (!tag)
    return res.status(404).send("The tag with the given ID was not found.");

  res.send(tag);
});

module.exports = router;
