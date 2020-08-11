const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Kitchen } = require("../models/kitchen"); //
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const kitchens = await Kitchen.find();
  res.send(kitchens);
});

router.post("/", async (req, res) => {
  let kitchen = new Kitchen({
    title: req.body.title,
  });
  kitchen = await kitchen.save();

  res.send(kitchen);
});

module.exports = router;
