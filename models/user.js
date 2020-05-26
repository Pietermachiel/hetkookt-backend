const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("@hapi/joi");
const { recipeSchema } = require("./recipe");

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
  // recipes: {
  //   type: recipeSchema,
  //   required: true
  // }
  recipes: [],
  favorites: [],
  stock: [],
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
    recipes: Joi.array(),
    favorites: Joi.array(),
    stock: Joi.array(),
  });
  const validation = schema.validate(user);
  return validation;
}

exports.User = User;
exports.validateUser = validateUser;
