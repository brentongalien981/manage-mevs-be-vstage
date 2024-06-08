const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const OrderStatus = require("../models/orderStatus");
const My = require("../utils/My");


const initialOrderStatuses = [
  { name: "ORDER_FAILED", value: -100, readableName: "Order Failed" },
  { name: "ORDER_PROCESS_NOT_COMPLETE", value: -200, readableName: "Order Process Not Complete" },
  { name: "REFUND_NOT_COMPLETE", value: -300, readableName: "Refund Not Complete" },
  { name: "DELIVERY_NOT_COMPLETE", value: -401, readableName: "Delivery Not Complete" },

  { name: "SELECT_ORDER_STATUS", value: 0, readableName: "Select Order Status" },

  { name: "PAYMENT_RECEIVED", value: 100, readableName: "Payment Received" },
  { name: "ORDER_PROCESSING", value: 200, readableName: "Order Processing" },
  { name: "ORDER_PROCESSED", value: 201, readableName: "Order Processed" },

  { name: "REFUND_PROCESSING", value: 300, readableName: "Refund Processing" },
  { name: "REFUND_COMPLETE", value: 301, readableName: "Refund Complete" },

  { name: "ORDER_DISPATCHED", value: 400, readableName: "Order Dispatched" },
  { name: "ORDER_BEING_SHIPPED", value: 401, readableName: "Order Being Shipped" },
  { name: "ORDER_DELIVERED", value: 402, readableName: "Order Delivered" },
];


async function generateDefaultOrderStatuses(numItems = 1) {

  const items = [];

  for (let i = 0; i < initialOrderStatuses.length; i++) {

    const item = new OrderStatus({
      ...initialOrderStatuses[i],
      _id: new mongoose.Types.ObjectId(),
    });

    items.push(item);

  }

  await OrderStatus.insertMany(items);

}


async function getRandomOrderStatus() {
  const orderStatuses = await OrderStatus.find();
  const randomNum = My.getRandomNumber(0, orderStatuses.length - 1);
  return orderStatuses[randomNum];
}


module.exports = {
  generateDefaultOrderStatuses,
  getRandomOrderStatus
};