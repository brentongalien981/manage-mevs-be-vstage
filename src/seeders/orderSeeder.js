const mongoose = require("mongoose");
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const { generateOrders, generateOrdersWithinDateRange } = require("../factories/orderFactory");
const MyDateUtils = require("../utils/MyDateUtils");


async function seedOrder() {
  const numItems = 500;
  const startDateStr = "2014-01-01"; // Around 10 years back.
  const endDateStr = MyDateUtils.getDateString(); // Today's date.
  await generateOrdersWithinDateRange({ numItems, startDateStr, endDateStr });  
}


async function unseedOrder() {
  await OrderItem.deleteMany({});
  await Order.deleteMany({});
}


module.exports = {
  seedOrder,
  unseedOrder
};