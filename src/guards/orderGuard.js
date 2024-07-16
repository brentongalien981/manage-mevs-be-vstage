const MevNotAllowedActionError = require("../errors/MevNotAllowedActionError");
const specificErrorHandlerMiddleware = require("../middlewares/specificErrorHandlerMiddleware");
const Order = require("../models/order");
const OrderStatus = require("../models/orderStatus");

const orderGuard = {
  buyShippingLabel: async (req, res, next) => {
    try {
      const order = await Order.findById(req.body.orderId);

      // If order already has a shipmentId or has a status that doesn't allow buying a shipping label, return an error.
      if (order.shipmentId || !(await isOrderAllowedToBuyShippingLabel(order))) {
        const error = new MevNotAllowedActionError();
        return specificErrorHandlerMiddleware(error, req, res, next);

      }

      // Otherwise, request is ok, so proceed to the next middleware.
      next();
    } catch (e) {
      // Handle any errors.
      next(e);
    }
  }
};


async function isOrderAllowedToBuyShippingLabel(order) {
  // Get the order status of the order.
  const orderStatus = await OrderStatus.findById(order.orderStatus);

  // Allowed order-status names to buy shipping label.
  const allowedOrderStatusNames = [
    "SELECT_ORDER_STATUS",
    "PAYMENT_RECEIVED",
    "ORDER_PROCESSING",
    "ORDER_PROCESSED",
  ];

  if (allowedOrderStatusNames.includes(orderStatus.name)) {
    return true;
  }

  return false;

}


module.exports = orderGuard;