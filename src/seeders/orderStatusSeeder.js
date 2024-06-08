const mongoose = require("mongoose");
const OrderStatus = require("../models/orderStatus");
const { generateDefaultOrderStatuses } = require("../factories/orderStatusFactory");


async function seedOrderStatus() {
  await generateDefaultOrderStatuses();
}


async function unseedOrderStatus() {
  await OrderStatus.deleteMany({});
}


module.exports = {
  seedOrderStatus,
  unseedOrderStatus
};