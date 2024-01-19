var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/Goauth");

const userSchema = mongoose.Schema({
  email: String,
  name: String,
});

module.exports = mongoose.model("users", userSchema);
