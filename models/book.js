const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const { string } = require("@hapi/joi");

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 50,
  },
  author: { type: String },
  publisher: { type: String },
  source: { type: String },
  year: { type: Number },
  kitchen: { type: mongoose.Schema.Types.ObjectId, ref: "Kitchen" },
  text: { type: String },
});

const Book = mongoose.model("Book", bookSchema);

function validateBook(book) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50),
    author: Joi.string(),
    publisher: Joi.string(),
    source: Joi.string(),
    year: Joi.number(),
    kitchen: Joi.string(),
    text: Joi.string(),
  });
  const validation = schema.validate(book);
  return validation;
}

exports.bookSchema = bookSchema;
exports.Book = Book;
exports.validate = validateBook;
