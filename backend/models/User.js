const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true }, // "Apple" or "Banana"
  password: { type: String, required: true }, // hashed password recommended
});

module.exports = mongoose.model("User", userSchema);
