const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 24,
  },
});

const Dish = mongoose.model("Dish", dishSchema);

function validateDish(dish) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(20).required(),
  });
  const validation = schema.validate(dish);
  return validation;
}

exports.Dish = Dish;
exports.dishSchema = dishSchema;
exports.validate = validateDish;
