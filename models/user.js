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
    minlength: 2,
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
    minlength: 2,
    maxlength: 50,
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

// item

var itemSchema = new mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  _id: { type: String },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  dish: { type: Object },
  tag: [{ type: Object }],
  book: { type: Object },
  // dish: { type: mongoose.Schema.Types.ObjectId, ref: "Dish" },
  // tag: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  related: [{ type: Object }],
  fresh: [{ type: Object }],
  stock: [{ type: Object }],
  directions: [{ type: Object }],
  info: { type: String },
  // date: [dateSchema],
  myrecipe: { type: Boolean },
});

const Item = mongoose.model("Item", itemSchema);

function validateItems(item) {
  var schema = Joi.object({
    // _id: Joi.string(),
    title: Joi.string().min(2).max(50).required(),
    dish: Joi.string(),
    book: Joi.string(),
    tag: Joi.array(),
    related: Joi.array(),
    fresh: Joi.array(),
    stock: Joi.array(),
    directions: Joi.array(),
    info: Joi.string().empty(""),
    myrecipe: Joi.boolean(),
  });
  var validation = schema.validate(item);
  return validation;
}

// grocery

var grocerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 255,
  },
  dish: dishSchema,
  tag: [tagSchema],
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

// nothetkookt

var nothetkooktSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 255,
  },
  dish: dishSchema,
  tag: [tagSchema],
  link: { type: String },
});

const Nothetkookt = mongoose.model("Nothetkookt", nothetkooktSchema);

function validateNothetkookt(nothetkookt) {
  var schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    dish: Joi.string(),
    tag: Joi.array(),
    link: Joi.string().empty(""),
  });
  var validation = schema.validate(nothetkookt);
  return validation;
}

// niethetkookt

var niethetkooktSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 255,
  },
  site_name: { type: String },
  dish: dishSchema,
  link: { type: String },
});

const Niethetkookt = mongoose.model("Niethetkookt", niethetkooktSchema);

function validateNiethetkookt(niethetkookt) {
  var schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    site_name: Joi.string(),
    dish: Joi.string(),
    link: Joi.string(),
  });
  var validation = schema.validate(niethetkookt);
  return validation;
}

// info

var infosSchema = new mongoose.Schema({
  title: { type: String },
  dish: dishSchema,
  info_id: { type: String },
  text: {
    type: String,
    trim: true,
    minlength: 2,
    maxlength: 1000,
  },
});

const Infos = mongoose.model("Infos", infosSchema);

function validateInfos(infos) {
  var schema = Joi.object({
    title: Joi.string(),
    dish: Joi.string(),
    info_id: Joi.string(),
    text: Joi.string().min(2).max(1000),
  });
  var validation = schema.validate(infos);
  return validation;
}

// user

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
  nothetkookt: [nothetkooktSchema],
  niethetkookt: [niethetkooktSchema],
  stocks: [],
  extra: [],
  infos: [infosSchema],
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
    nothetkookt: Joi.array(),
    niethetkookt: Joi.array(),
    stocks: Joi.array(),
    extra: Joi.array(),
    infos: Joi.array(),
    registrationDate: Joi.date(),
  });
  const validation = schema.validate(user);
  return validation;
}

exports.User = User;
exports.validateUser = validateUser;
exports.validateItems = validateItems;
exports.validateGroceries = validateGroceries;
exports.validateNothetkookt = validateNothetkookt;
exports.validateNiethetkookt = validateNiethetkookt;
exports.validateInfos = validateInfos;
