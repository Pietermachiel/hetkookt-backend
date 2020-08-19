const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    stories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Story" }],
  },
});

const Author = mongoose.model("Author", authorSchema);

exports.Author = Author;
exports.authorSchema = authorSchema;
