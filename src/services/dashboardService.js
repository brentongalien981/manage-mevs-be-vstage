const Order = require("../models/order");
const OrderStatus = require("../models/orderStatus");
const My = require("../utils/My");
const MyDateUtils = require("../utils/MyDateUtils");
const { calculateTotalAmount } = require("./orderService");

const NUM_DAYS_IN_YEAR = 365;

const dashboardService = {
  query: async (req) => {

    let { rangeStartDateStr, rangeEndDateStr } = req.body;

    // Get orders data within current date range.
    const ordersDataForCurrentDateRange = await getOrdersDataForDateRange(rangeStartDateStr, rangeEndDateStr);

    // Set the previous date range variables
    const { previousRangeStartDateStr, previousRangeEndDateStr } = getPerviousDateRange(rangeStartDateStr, rangeEndDateStr);

    // Get orders data for previous date range.
    const ordersDataForPreviousDateRange = await getOrdersDataForDateRange(previousRangeStartDateStr, previousRangeEndDateStr);

    return {
      ordersDataForCurrentDateRange: await reduceOrdersData(ordersDataForCurrentDateRange),
      ordersDataForPreviousDateRange: await reduceOrdersData(ordersDataForPreviousDateRange)
    }
  }
};


function getPerviousDateRange(rangeStartDateStr, rangeEndDateStr) {
  const numDaysBetweenRange = MyDateUtils.getNumDayBetweenDates(
    rangeStartDateStr,
    rangeEndDateStr
  );
  const numYearsBetweenRange = Math.ceil(numDaysBetweenRange / NUM_DAYS_IN_YEAR);
  const numDaysToGoBack = -1 * numYearsBetweenRange * NUM_DAYS_IN_YEAR;

  const previousRangeStartDateStr = MyDateUtils.getDateStringWithOffset(
    new Date(rangeStartDateStr),
    numDaysToGoBack
  );
  const previousRangeEndDateStr = MyDateUtils.getDateStringWithOffset(
    new Date(rangeEndDateStr),
    numDaysToGoBack
  );

  return { previousRangeStartDateStr, previousRangeEndDateStr };

}


async function getOrdersDataForDateRange(rangeStartDateStr, rangeEndDateStr) {

  const rangeStartDateTimeStr = rangeStartDateStr + "T00:00:00.000Z";
  const rangeEndDateTimeStr = rangeEndDateStr + "T23:59:59.999Z";

  const ordersDataForDateRange = await Order.find({
    createdAt: { $gte: rangeStartDateTimeStr, $lte: rangeEndDateTimeStr }
  });
  return ordersDataForDateRange;
}


async function reduceOrdersData(orders) {

  const reducedOrders = [];

  for (const order of orders) {
    const orderStatus = await OrderStatus.findById(order.orderStatus);

    reducedOrders.push({
      statusName: orderStatus.name,
      totalAmount: (await calculateTotalAmount(order)),
      createdAt: order.createdAt
    });
  }

  return reducedOrders;
}


function getNumOfProcessingOrdersFromOrdersData(ordersData) {

  let numOfProcessingOrders = 0;

  for (const order of ordersData) {
    if (order.statusName === "ORDER_PROCESSING") {
      numOfProcessingOrders++;
    }
  }

  return numOfProcessingOrders;
}


module.exports = {
  dashboardService,
  reduceOrdersData,
  getNumOfProcessingOrdersFromOrdersData
};