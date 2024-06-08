const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  model: String,
  brand: {
    type: "ObjectId",
    ref: "Brand"
  },
  category: {
    type: "ObjectId",
    ref: "Category"
  },
  description: {
    type: String,
    trim: true,
    maxLength: 1024,
    default: ""
  },
  quantity: { type: Number, default: 0 },
  price: Number,
  imageLinks: [{ type: String }]
}, { timestamps: true });


const Product = mongoose.model("Product", productSchema);


module.exports = Product;