const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
  authorID: String,
  eggs: Number,
  bio: String,
  totalPosts: Number
});

module.exports = mongoose.model("profiles", profileSchema);