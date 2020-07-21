const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("@hapi/joi");
const { string } = require("@hapi/joi");

const tagsSchema = new mongoose.Schema({
  name: { type: String },
});

const basicsSchema = mongoose.Schema({
  name: { type: String },
});

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

const itemSchema = mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  title: { type: String },
  dish: { type: String },
  tags: [tagsSchema],
  basics: [basicsSchema],
  related: [relatedSchema],
  fresh: [freshSchema],
  stock: [stockSchema],
  directions: [directionsSchema],
  author: { type: String },
  source: { type: String },
  source_url: { type: String },
  info: { type: String },
  date: [dateSchema],
  item: { type: Boolean, default: false },
});

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
  temporarytoken: {
    type: String,
  },
  active: {
    type: Boolean,
    default: false,
  },
  items: [itemSchema],
  stock: [],
  extra: [],
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
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
    stock: Joi.array(),
    extra: Joi.array(),
  });
  const validation = schema.validate(user);
  return validation;
}

function validateItems(item) {
  const schema = Joi.array().items(
    Joi.object({
      _id: Joi.string(),
      title: Joi.string(),
      dish: Joi.string(),
      tags: Joi.array(),
      basics: Joi.array(),
      related: Joi.array(),
      fresh: Joi.array(),
      stock: Joi.array(),
      directions: Joi.array(),
      author: Joi.string().empty(""),
      source: Joi.string().empty(""),
      source_url: Joi.string().empty(""),
      info: Joi.string().empty(""),
      date: Joi.array(),
      item: Joi.boolean(),
    })
  );

  const validation = schema.validate(item);
  return validation;
}

exports.User = User;
exports.validateUser = validateUser;
exports.validateItems = validateItems;
