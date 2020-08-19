const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
    name: Joi.string().min(2).max(24).required(),
    category: Joi.string().min(2).max(24).required(),
  });
  const validation = schema.validate(tag);
  return validation;
}

exports.Tag = Tag;
exports.tagSchema = tagSchema;
exports.validate = validateTag;
