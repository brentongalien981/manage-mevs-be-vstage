const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const OrderStatus = require("../models/orderStatus");
const My = require("../utils/My");


const NUM_DATA_PER_PAGE = 10;
const TAX_RATE = 0.13;


const orderService = {

  queryOrders: async function (reqQueryObj) {

    const aggregateFilters = await buildAggregateFilters(reqQueryObj.ordersFilters);
    const sortFilters = buildSortFilter(reqQueryObj.sortFilters);
    const numDataToSkip = getNumDataToSkip(reqQueryObj.pageNavigatorData);

    // Prepare the aggregate pipelines.
    const ordersCountPipeline = [
      {
        // Convert ObjectId fields to string for comparison.
        $addFields: {
          idStr: { $toString: "$_id" },
          orderStatusStr: { $toString: "$orderStatus" }
        }
      },
      { $match: { $and: aggregateFilters } }
    ];

    const ordersDataPipeline = [
      ...ordersCountPipeline,
      { $sort: sortFilters },
      { $skip: numDataToSkip },
      { $limit: NUM_DATA_PER_PAGE }
    ];

    const ordersCountWithFilters = (await Order.aggregate(ordersCountPipeline)).length;
    let orders = await Order.aggregate(ordersDataPipeline);

    // Modify orders to include Order Status.
    for (let i = 0; i < orders.length; i++) {
      const orderStatus = await OrderStatus.findById(orders[i].orderStatus);
      orders[i].orderStatus = orderStatus;
    }

    return { orders, ordersCountWithFilters };
  },

  updateOrder: async function (req) {
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

    // Validate and update the order.
    const updatedOrder = await Order.findByIdAndUpdate(orderId, sanitizedOrderData, { runValidators: true, new: true });

    return updatedOrder;

  }

};



async function buildAggregateFilters(ordersFilters) {

  const aggregateFilters = [];
  // Use this order status as reference.
  const placeholderOrderStatus = await OrderStatus.findOne({ name: "SELECT_ORDER_STATUS" });

  for (let i = 0; i < ordersFilters.length; i++) {

    const filter = ordersFilters[i];
    let filterName = filter.name;
    let filterValue = filter.value;

    switch (filterName) {
      case "orderId":
        filterName = "idStr";
        break;
      case "orderStatus":
        // For order-status, query for the ObjectId of the provided order-status based on
        // its value.
        const theOrderStatus = (await OrderStatus.find({ value: filterValue }))[0];

        // Don't include the orderStatus as filter if the "SELECT_ORDER_STATUS" orderStatus is chosen.
        if (theOrderStatus.value == placeholderOrderStatus.value) {
          continue;
        }

        // Otherwise, build and include the orderStatus filter.
        filterName = "orderStatusStr";
        filterValue = theOrderStatus.id;
        break;
      case "orderDateStart":
        filterName = "createdAt";
        filterValue = { $gte: new Date(filterValue) };
        aggregateFilters.push({ [filterName]: filterValue });
        continue;
        break;
      case "orderDateEnd":
        filterName = "createdAt";
        filterValue = { $lte: new Date(filterValue) };
        aggregateFilters.push({ [filterName]: filterValue });
        continue;
        break;
    }

    aggregateFilters.push({ [filterName]: { $regex: new RegExp(filterValue, "i") } });

  }

  return aggregateFilters;
}


function buildSortFilter(sortFiltersData = []) {

  let builtSortFilter = null;

  for (const aSortFilter of sortFiltersData) {

    const filterName = aSortFilter.name;
    const filterValue = (aSortFilter.sortOrder === "ascending" ? 1 : -1);

    builtSortFilter = {
      ...builtSortFilter,
      [filterName]: filterValue
    };
  }

  if (builtSortFilter == null) {
    builtSortFilter = { createdAt: 1 }; // Default sort order.
  }

  return builtSortFilter;

}


function getNumDataToSkip(pageNavigatorData) {
  const pageNum = parseInt(pageNavigatorData.page);
  const numDataToSkip = (pageNum - 1) * NUM_DATA_PER_PAGE;
  return numDataToSkip;
}


async function calculateTotalAmount(order) {
  let subtotal = await calculateOrderItemsSubtotal(order);
  subtotal += order.shippingFee;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  return parseFloat(total.toFixed(2));
}


async function calculateOrderItemsSubtotal(order) {

  const orderItems = await OrderItem.find({ order: order.id });

  let orderSubtotal = 0;

  orderItems.forEach(i => {
    const itemSubtotal = i.price * i.quantity;
    orderSubtotal += itemSubtotal
  });

  return orderSubtotal;
}


module.exports = orderService;
module.exports.buildAggregateFilters = buildAggregateFilters;
module.exports.buildSortFilter = buildSortFilter;
module.exports.TAX_RATE = TAX_RATE;
module.exports.calculateTotalAmount = calculateTotalAmount;