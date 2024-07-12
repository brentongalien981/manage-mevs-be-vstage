const MyMongooseValidationError = require("../errors/MyMongooseValidationError");
const multipleErrorsErrorHandlerMiddleware = require("../middlewares/multipleErrorsErrorHandlerMiddleware");
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
      const order = await orderService.getOrder(orderId);

      res.json({
        msg: "Request OK for GET route: /orders/:orderId",
        order
      });
    } catch (e) {
      next(e);
    }
  },

  updateOrder: async function (req, res, next) {

    try {
      const updatedOrder = await orderService.updateOrder(req);

      // Respond with the updated order.
      res.json({
        msg: `Request OK for PUT route: /orders/:orderId`,
        updatedOrder
      });
    } catch (e) {
      // Handle Mongoose CastError and ValidationError.
      if (e.name === "ValidationError") {
        const error = new MyMongooseValidationError({ validationErrors: e.errors });
        return multipleErrorsErrorHandlerMiddleware(error, req, res, next);
      }

      // Or handle any other errors.
      next(e);
    }

  },

  buyShippingLabel: async function (req, res, next) {
    try {

      // Buy shipping label here.
      await orderService.buyShippingLabel(req);

      // Return the order with the updated shipmentId, shipment label url, and tracker url.
      const updatedOrder = await orderService.getOrder(req.body.orderId);

      res.json({
        msg: `Request OK for POST route: /orders/buyShippingLabel`,
        updatedOrder      
      });
    } catch (e) {
      // Handle errors.
      next(e);
    }
  }
};


module.exports = orderController;