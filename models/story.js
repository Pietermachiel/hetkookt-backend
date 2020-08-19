var mongoose = require("mongoose");
const Joi = require("@hapi/joi");

var storySchema = mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
});

var Story = mongoose.model("Story", storySchema);

function validateStory(story) {
  const schema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
  });
  const validation = schema.validate(story);
  return validation;
}

exports.Story = Story;
exports.storySchema = storySchema;
exports.validateStory = validateStory;
