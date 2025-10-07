const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  AppleDone: { type: Boolean, default: false },
  BananaDone: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
