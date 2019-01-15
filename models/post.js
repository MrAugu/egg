const mongoose = require("mongoose");

const prePostSchema = mongoose.Schema({
  id: Number,
  authorID: String,
  uploadedAt: String,
  url: String,
  upVotes: Number,
  downVotes: Number,
  aprovedBy: String
});

module.exports = mongoose.model("posts", prePostSchema);