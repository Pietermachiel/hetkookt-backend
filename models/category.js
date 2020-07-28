const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Category = mongoose.model("Category", categorySchema);

function validatecategory(category) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });
  const validation = schema.validate(category);
  return validation;
}

exports.categorySchema = categorySchema;
exports.Category = Category;
exports.validate = validatecategory;
