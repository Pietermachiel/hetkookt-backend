const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const kitchenSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Kitchen = mongoose.model("Kitchen", kitchenSchema);

exports.kitchenSchema = kitchenSchema;
exports.Kitchen = Kitchen;
