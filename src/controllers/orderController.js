const Order = require("../models/order");
const orderService = require("../services/orderService");
const My = require("../utils/My");

const orderController = {

  queryOrders: async function (req, res, next) {

    // LATER: Delete.
    await My.sleep(1000);

    const reqQueryObj = JSON.parse(req.query.queryObj);

    try {

      const orders = await orderService.queryOrders(reqQueryObj);
      const ordersCountWithFilters = await orderService.getOrdersCountWithFilters(reqQueryObj.ordersFilters);

      res.json({
        msg: "Request OK for GET route: /orders/queryOrders",
        orders,
        ordersCountWithFilters
      });

    } catch (e) {
      next(e);
    }

  }

};


module.exports = orderController;