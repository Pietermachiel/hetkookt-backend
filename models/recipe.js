const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const { dishSchema } = require("./dish");

const relatedSchema = mongoose.Schema({
  name: { type: String },
});

const dateSchema = mongoose.Schema({
  name: { type: String },
});

const freshSchema = new mongoose.Schema({
  ingredient: { type: String },
  quantity: { type: Number, default: "" },
  unit: { type: String },
  to_buy: { type: Boolean, default: true },
});

const stockSchema = new mongoose.Schema({
  ingredient: { type: String },
  quantity: { type: String, default: "" },
  unit: { type: String },
  to_buy: { type: Boolean, default: true },
});

const directionsSchema = mongoose.Schema({
  name: { type: String },
});

var recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  dish: { type: mongoose.Schema.Types.ObjectId, ref: "Dish" },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  },
  related: [relatedSchema],
  fresh: [freshSchema],
  stock: [stockSchema],
  directions: [directionsSchema],
  info: { type: String },
  date: [dateSchema],
});

const Recipe = mongoose.model("Recipe", recipeSchema);

function validateRecipe(recipe) {
  var schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    dish: Joi.object(),
    tags: Joi.array().empty(""),
    book: Joi.object().empty(""),
    related: Joi.array(),
    fresh: Joi.array(),
    stock: Joi.array(),
    directions: Joi.array(),
    info: Joi.string().empty(""),
    date: Joi.array(),
  });
  var validation = schema.validate(recipe);
  return validation;
}

exports.Recipe = Recipe;
exports.recipeSchema = recipeSchema;
exports.validateRecipe = validateRecipe;
