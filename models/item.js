const mongoose = require("mongoose");

const freshSchema = new mongoose.Schema({
  ingredient: { type: String, required: false },
  quantity: { type: Number, required: false },
  unit: { type: String, required: false },
});

const stockSchema = new mongoose.Schema({
  ingredient: { type: String, required: false },
  quantity: { type: Number, required: false },
  unit: { type: String, required: false },
});

const itemSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  dish: { type: String, required: true },
  fresh: [freshSchema],
  stock: [stockSchema],
  tags: { type: Array, required: false },
  directions: { type: Array, required: false },
  info: { type: String, required: false },
  isOpen: { type: Boolean, default: false },
  favorite: { type: Boolean, default: false },
  date: { type: String },
});

//create and export the model
module.exports = mongoose.model("Item", itemSchema);

//this is a simple Mongoose Model
