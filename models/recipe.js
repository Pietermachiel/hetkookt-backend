const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const { tagSchema } = require("./tag");

var Recipe = mongoose.model(
  "Recipe",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    tag: [{ type: tagSchema }],
  })
);

function validateRecipe(recipe) {
  var schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    book: Joi.objectId(),
    tag: Joi.array(),
  });
  var validation = schema.validate(recipe);
  return validation;
}

exports.Recipe = Recipe;
exports.validate = validateRecipe;
