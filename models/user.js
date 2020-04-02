const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("@hapi/joi");
const { recipeSchema } = require("./recipe");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  // recipes: {
  //   type: recipeSchema,
  //   required: true
  // }
  recipes: []
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      favorites: this.favorites
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    email: Joi.string()
      .min(2)
      .max(50)
      .required()
      .email(),
    password: Joi.string()
      .min(2)
      .max(50)
      .required(),
    recipes: Joi.array()
  });
  const validation = schema.validate(user);
  return validation;
}

exports.User = User;
exports.validateUser = validateUser;
