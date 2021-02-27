const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("@hapi/joi");
const { string } = require("@hapi/joi");

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

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 50,
  },
  author: { type: String },
  publisher: { type: String },
  source: { type: String },
  year: { type: Number },
  kitchen: { type: mongoose.Schema.Types.ObjectId, ref: "Kitchen" },
  text: { type: String },
});

const dateSchema = mongoose.Schema({
  name: { type: String },
});

const freshSchema = new mongoose.Schema({
  ingredienttag: { name: { type: String } },
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
  tag: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
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
  tag: [tagSchema],
  book: bookSchema,
  // dish: { type: mongoose.Schema.Types.ObjectId, ref: "Dish" },
  // tag: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  related: [relatedSchema],
  fresh: [freshSchema],
  stock: [stockSchema],
  directions: [directionsSchema],
  info: { type: String },
  date: [dateSchema],
  myrecipe: { type: Boolean, default: true },
});

const Item = mongoose.model("Item", itemSchema);

function validateItems(item) {
  var schema = Joi.object({
    // _id: Joi.string(),
    title: Joi.string().min(5).max(50).required(),
    dish: Joi.string(),
    tag: Joi.array(),
    related: Joi.array(),
    fresh: Joi.array(),
    stock: Joi.array(),
    directions: Joi.array(),
    info: Joi.string().empty(""),
    date: Joi.array(),
    myrecipe: Joi.boolean(),
  });
  var validation = schema.validate(item);
  return validation;
}

var grocerySchema = new mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  dish: dishSchema,
  tag: [tagSchema],
  // dish: { type: mongoose.Schema.Types.ObjectId, ref: "Dish" },
  // tag: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  related: [relatedSchema],
  fresh: [freshSchema],
  stock: [stockSchema],
  directions: [directionsSchema],
  book: bookSchema,
  info: { type: String },
});

const Grocery = mongoose.model("Grocery", grocerySchema);

function validateGroceries(grocery) {
  var schema = Joi.object({
    // _id: Joi.string(),
    title: Joi.string().min(5).max(50).required(),
    dish: Joi.string(),
    tag: Joi.array(),
    related: Joi.array(),
    fresh: Joi.array(),
    stock: Joi.array(),
    directions: Joi.array(),
    book: Joi.string(),
    info: Joi.string().empty(""),
  });
  var validation = schema.validate(grocery);
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
  groceries: [grocerySchema],
  stock: [],
  extra: [],
  registrationDate: {
    type: Date,
    default: Date.now,
  },
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
    grocery: Joi.array(),
    stock: Joi.array(),
    extra: Joi.array(),
    registrationDate: Joi.date(),
  });
  const validation = schema.validate(user);
  return validation;
}

exports.User = User;
exports.validateUser = validateUser;
exports.validateItems = validateItems;
exports.validateGroceries = validateGroceries;
