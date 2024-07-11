const MyMongooseValidationError = require("../errors/MyMongooseValidationError");
const multipleErrorsErrorHandlerMiddleware = require("../middlewares/multipleErrorsErrorHandlerMiddleware");
const Brand = require("../models/brand");
const Category = require("../models/category");
const Order = require("../models/order");
const Product = require("../models/product");
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
      const order = await Order.findById(orderId)
        .populate("orderStatus")
        .populate({
          path: 'orderItems', // Populate orderItems
          populate: {
            path: 'product', // Further populate product within each orderItem
            model: Product,
            populate: [
              {
                path: 'brand', // Populate brand within each product
                model: Brand,
                select: 'name' // Only include the name field of brand
              },
              {
                path: 'category', // Populate category within each product
                model: Category,
                select: 'name' // Only include the name field of category
              }
            ]

          }
        });

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

      // TODO: Buy shipping label here.

      res.json({
        msg: `Request OK for POST route: /orders/buyShippingLabel`        
      });
    } catch (e) {
      // Handle errors.
      next(e);
    }
  }
};


module.exports = orderController;