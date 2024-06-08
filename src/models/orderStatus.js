const mongoose = require("mongoose");


const orderStatusSchema = new mongoose.Schema({
  name: { type: String, maxLength: 256, required: true },
  value: { type: Number, required: true },
  readableName: { type: String, maxLength: 256, required: true },
  description: String
}, { timestamps: true });


const OrderStatus = mongoose.model("OrderStatus", orderStatusSchema);


module.exports = OrderStatus;