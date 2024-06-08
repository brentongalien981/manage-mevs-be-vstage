const mongoose = require("mongoose");


const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  isActive: Boolean
}, { timestamps: true });


const Category = mongoose.model("Category", categorySchema);


module.exports = Category;