const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const kitchenSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 24,
  },
});

const Kitchen = mongoose.model("Kitchen", kitchenSchema);

function validateKitchen(kitchen) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(24).required(),
  });
  const validation = schema.validate(kitchen);
  return validation;
}

exports.kitchenSchema = kitchenSchema;
exports.validate = validateKitchen;
exports.Kitchen = Kitchen;
