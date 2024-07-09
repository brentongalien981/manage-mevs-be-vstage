const Order = require("../models/order");
const OrderStatus = require("../models/orderStatus");
const orderService = require("../services/orderService");
const My = require("../utils/My");

const orderController = {

  queryOrders: async function (req, res, next) {

    // LATER: Delete.
    await My.sleep(1000);

    const reqQueryObj = JSON.parse(req.query.queryObj);

    try {

      const { orders, ordersCountWithFilters } = await orderService.queryOrders(reqQueryObj);

      res.json({
        msg: "Request OK for GET route: /orders/queryOrders",
        orders,
        ordersCountWithFilters
      });

    } catch (e) {
      next(e);
    }

  },

  getOrder: async function (req, res, next) {

    const orderId = req.params.orderId;

    try {
      const order = await Order.findById(orderId).populate("orderStatus");
      res.json({
        msg: "Request OK for GET route: /orders/:orderId",
        order
      });
    } catch (e) {
      next(e);
    }
  },

  updateOrder: async function (req, res, next) {

    // TODO: Move to orderService file.
    const orderId = req.params.orderId;
    const orderData = req.body;
    const sanitizedOrderData = {};

    // Set the sanitized order data.
    for (const key in orderData) {
      if (key === "orderStatusValue") {
        const orderStatus = await OrderStatus.findOne({ value: orderData.orderStatusValue });
        sanitizedOrderData.orderStatus = orderStatus._id;
      } else {
        sanitizedOrderData[key] = orderData[key];
      }
    }

    try {
      // TODO: Update the order.
      const updatedOrder = await Order.findByIdAndUpdate(orderId, sanitizedOrderData, { runValidators: true, new: true });

      // Respond with the updated order.
      res.json({
        msg: `Request OK for PUT route: /orders/:orderId`,
        sanitizedOrderData,
        updatedOrder
      });
    } catch (e) {
      // TODO: Handle Mongoose CastError and ValidationError.

      // Handle any other errors.
      next(e);
    }

  }
};


module.exports = orderController;