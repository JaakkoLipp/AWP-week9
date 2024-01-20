const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [String],
});

module.exports = mongoose.model("Todo", TodoSchema);
