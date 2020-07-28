const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  kitchen: { type: mongoose.Schema.Types.ObjectId, ref: "Kitchen" },
});

const Book = mongoose.model("Book", bookSchema);

function validateBook(book) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    kitchen: Joi.string().min(5).max(50).required(),
  });
  const validation = schema.validate(book);
  return validation;
}

exports.bookSchema = bookSchema;
exports.Book = Book;
exports.validate = validateBook;
