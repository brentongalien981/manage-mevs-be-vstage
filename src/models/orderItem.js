const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  order: {
    type: "ObjectId",
    ref: "Order",
    required: true
  },
  product: {
    type: "ObjectId",
    ref: "Product",
    required: true
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },  
}, { timestamps: true });

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

module.exports = OrderItem;