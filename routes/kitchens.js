const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Kitchen, validate } = require("../models/kitchen"); //
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const kitchens = await Kitchen.find();
  res.send(kitchens);
});

router.post("/", async (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let kitchen = new Kitchen({
    name: req.body.name,
  });
  kitchen = await kitchen.save();

  res.send(kitchen);
});

module.exports = router;
