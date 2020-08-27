const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 24,
  },
});

const Category = mongoose.model("Category", categorySchema);

function validateCategory(category) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(24),
  });
  const validation = schema.validate(category);
  return validation;
}

exports.categorySchema = categorySchema;
exports.Category = Category;
exports.validateCategory = validateCategory;
