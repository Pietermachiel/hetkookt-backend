const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const { categorySchema } = require("./category");

const tagSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  category: {
    type: categorySchema,
    required: true,
  },
});

const Tag = mongoose.model("Tag", tagSchema);

function validateTag(tag) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    categoryId: Joi.objectId().required(),
  });
  const validation = schema.validate(tag);
  return validation;
}

exports.Tag = Tag;
exports.tagSchema = tagSchema;
exports.validate = validateTag;
