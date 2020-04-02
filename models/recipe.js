const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

// const itemSchema = new mongoose.Schema({
//   item: String,
//   quantity: Number,
//   unit: String
// });

const tagsSchema = new mongoose.Schema({
  item: String
});

const Recipe = new mongoose.model(
  "Recipe",
  mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    dish: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    tags: [tagsSchema],
    fresh: [],
    stock: [],
    basics: [],
    directions: [],
    date: {
      type: Date
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  })
);

function validateRecipe(recipe) {
  const schema = Joi.object({
    title: Joi.string()
      .min(2)
      .max(50)
      .required(),
    dish: Joi.string(),
    author: Joi.string()
      .min(2)
      .max(50)
      .required(),
    tags: Joi.array(),
    fresh: Joi.array(),
    stock: Joi.array(),
    basics: Joi.array(),
    directions: Joi.array(),
    date: Joi.date(),
    isOpen: Joi.boolean()
  });
  const validation = schema.validate(recipe);
  return validation;
}

exports.Recipe = Recipe;
exports.validateRecipe = validateRecipe;
