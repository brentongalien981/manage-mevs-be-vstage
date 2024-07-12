const mongoose = require("mongoose");
const OrderItem = require("./orderItem");

const orderSchema = new mongoose.Schema({
  stripePaymentIntentId: { type: String },
  shipmentId: { type: String },  
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  street1: { type: String, required: true },
  street2: { type: String },
  city: { type: String, required: true },
  province: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String },
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true },
  orderStatus: {
    type: "ObjectId",
    ref: "OrderStatus"
  },
  orderItems: [{
    type: "ObjectId",
    ref: "OrderItem"
  }],  
  tax: { type: Number },
  shippingFee: { type: Number },
}, { timestamps: true });


/** Instance Methods */
orderSchema.methods.getCustomerFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};


const Order = mongoose.model("Order", orderSchema);

module.exports = Order;