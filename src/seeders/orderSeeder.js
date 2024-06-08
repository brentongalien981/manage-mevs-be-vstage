const mongoose = require("mongoose");
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const { generateOrders } = require("../factories/orderFactory");


async function seedOrder() {
  await generateOrders(50);
}


async function unseedOrder() {
  await OrderItem.deleteMany({});
  await Order.deleteMany({});
}


module.exports = {
  seedOrder,
  unseedOrder
};