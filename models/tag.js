const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minlength: 2,
    maxlength: 24,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

const Tag = mongoose.model("Tag", tagSchema);

function validateTag(tag) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(24),
    category: Joi.string().min(2).max(24),
  });
  const validation = schema.validate(tag);
  return validation;
}

exports.Tag = Tag;
exports.tagSchema = tagSchema;
exports.validateTag = validateTag;
