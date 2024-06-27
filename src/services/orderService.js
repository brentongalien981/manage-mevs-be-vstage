const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const OrderStatus = require("../models/orderStatus");
const My = require("../utils/My");


const NUM_DATA_PER_PAGE = 10;
const TAX_RATE = 0.13;


const orderService = {

  queryOrders: async function (reqQueryObj) {

    const queryFilters = await buildOrderQueryFilter(reqQueryObj.ordersFilters);
    const sortFilters = buildSortFilter(reqQueryObj.sortFilters);
    const numDataToSkip = getNumDataToSkip(reqQueryObj.pageNavigatorData);

    const queriedOrders = await Order.find(queryFilters)
      .populate({
        path: "orderStatus",
        select: "name value -_id"
      })
      .sort(sortFilters)
      .skip(numDataToSkip)
      .limit(NUM_DATA_PER_PAGE)
      .exec();

    return queriedOrders;
  },


  getOrdersCountWithFilters: async function (ordersFilters) {

    const queryFilters = await buildOrderQueryFilter(ordersFilters);
    const count = await Order.countDocuments(queryFilters);
    return count;
  }

};


async function buildOrderQueryFilter(orderFilters) {

  const builtQueryFilter = {};

  for (let i = 0; i < orderFilters.length; i++) {

    const filter = orderFilters[i];
    const filterName = filter.name;
    const filterValue = filter.value;

    switch (filterName) {
      case "orderId":
        // For empty orderId value, skip including the filter.
        if (filterValue.trim() === "") {
          continue;
        }

        // For order-id, just use the plain value and not a regex value.
        builtQueryFilter._id = filterValue;
        break;
      case "orderStatus":
        // For order-status, query for the ObjectId of the provided order-status based on
        // its value.
        const theOrderStatus = (await OrderStatus.find({ value: filterValue }))[0];
        const placeholderOrderStatus = await OrderStatus.findOne({ name: "SELECT_ORDER_STATUS" });

        // Don't include the orderStatus as filter if the "SELECT_ORDER_STATUS" orderStatus is chosen.
        if (theOrderStatus.value == placeholderOrderStatus.value) {
          continue;
        }

        // Otherwise, build and include the orderStatus filter.
        builtQueryFilter.orderStatus = theOrderStatus._id;
        break;
      case "orderDateStart":
        builtQueryFilter.createdAt = { ...builtQueryFilter.createdAt, $gte: filterValue };
        break;
      case "orderDateEnd":
        builtQueryFilter.createdAt = { ...builtQueryFilter.createdAt, $lte: filterValue };
        break;
      default:
        // The rest of the filters can be used with Regex.
        builtQueryFilter[filterName] = new RegExp(filterValue, "i");
        break;
    }

  }

  return builtQueryFilter;
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
  return subtotal + tax;
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
module.exports.buildOrderQueryFilter = buildOrderQueryFilter;
module.exports.buildSortFilter = buildSortFilter;
module.exports.TAX_RATE = TAX_RATE;
module.exports.calculateTotalAmount = calculateTotalAmount;