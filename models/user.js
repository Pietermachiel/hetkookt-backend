const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("@hapi/joi");
const { string } = require("@hapi/joi");
// const { recipeSchema } = require("./recipe");
// const { dishSchema } = require("./dish");
// const { tagSchema } = require("./tag");
const recipeId = mongoose.Types.ObjectId().toHexString();

// var recipeSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//     minlength: 5,
//     maxlength: 255,
//   },
//   dish: { type: mongoose.Schema.Types.ObjectId, ref: "Dish" },
//   tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
//   book: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Book",
//   },
//   related: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Recipe",
//       default: [{ _id: recipeId }],
//     },
//   ],
//   fresh: [freshSchema],
//   stock: [stockSchema],
//   directions: [directionsSchema],
//   info: { type: String },
//   date: [dateSchema],
// });

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 24,
  },
});

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  category: {
    name: {
      type: String,
    },
  },
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

const relatedSchema = mongoose.Schema({
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
  related: [],
  fresh: [freshSchema],
  stock: [stockSchema],
  directions: [directionsSchema],
  info: { type: String },
  date: [dateSchema],
});

var itemSchema = new mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  dish: dishSchema,
  tags: [tagSchema],
  // dish: { type: mongoose.Schema.Types.ObjectId, ref: "Dish" },
  // tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  related: [relatedSchema],
  fresh: [freshSchema],
  stock: [stockSchema],
  directions: [directionsSchema],
  info: { type: String },
  date: [dateSchema],
});

const Item = mongoose.model("Item", itemSchema);

function validateItems(item) {
  var schema = Joi.object({
    // _id: Joi.string(),
    title: Joi.string().min(5).max(50).required(),
    dish: Joi.string(),
    tags: Joi.array(),
    related: Joi.array(),
    fresh: Joi.array(),
    stock: Joi.array(),
    directions: Joi.array(),
    info: Joi.string().empty(""),
    date: Joi.array(),
  });
  var validation = schema.validate(item);
  return validation;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  isAdmin: Boolean,
  temporarytoken: {
    type: String,
  },
  active: {
    type: Boolean,
    default: false,
  },
  items: [itemSchema],
  // recipes: [recipeSchema],
  stock: [],
  extra: [],
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(2).max(50).required().email(),
    password: Joi.string().min(2).max(50).required(),
    temporarytoken: Joi.string(),
    active: Joi.boolean().default(false),
    items: Joi.array(),
    // recipes: Joi.array(),
    stock: Joi.array(),
    extra: Joi.array(),
  });
  const validation = schema.validate(user);
  return validation;
}

exports.User = User;
exports.validateUser = validateUser;
exports.validateItems = validateItems;
