const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("@hapi/joi");

const freshSchema = new mongoose.Schema({
  ingredient: { type: String, required: false },
  quantity: { type: Number, default: "", required: false },
  unit: { type: String, required: false },
  to_buy: { type: Boolean, required: false, default: true },
});

const stockSchema = new mongoose.Schema({
  ingredient: { type: String, required: false },
  quantity: { type: String, default: "", required: false },
  unit: { type: String, required: false },
  to_buy: { type: Boolean, required: false, default: true },
});

const itemSchema = mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: false },
  dish: { type: String, required: false },
  tags: { type: Array, default: [], required: false },
  basics: { type: Array, default: [""], required: false },
  related: { type: Array, default: [], required: false },
  fresh: [freshSchema],
  stock: [stockSchema],
  directions: { type: Array, required: false },
  author: { type: String, required: false },
  source: { type: String, required: false },
  source_url: { type: String, required: false },
  info: { type: String, required: false },
  date: { type: Array, required: false },
  item: { type: Boolean, default: false, required: false },
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

exports.User = User;
exports.validateUser = validateUser;
