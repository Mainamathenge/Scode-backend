const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const todoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A todo must have a name"],
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, "A todo must have a duration"],
  },
});

todoSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
