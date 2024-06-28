const { dashboardService, getNumOfProcessingOrdersFromOrdersData } = require("../services/dashboardService");

const dashboardController = {
  query: async (req, res, next) => {


    try {

      const { ordersDataForCurrentDateRange, ordersDataForPreviousDateRange } = await dashboardService.query(req);
      const numOfProcessingOrdersForCurrentDateRange = getNumOfProcessingOrdersFromOrdersData(ordersDataForCurrentDateRange);
      const numOfProcessingOrdersForPreviousDateRange = getNumOfProcessingOrdersFromOrdersData(ordersDataForPreviousDateRange);

      res.status(200).json({
        msg: "Request OK for POST route: /dashboard/query",
        ordersDataForCurrentDateRange,
        ordersDataForPreviousDateRange,
        numOfProcessingOrdersForCurrentDateRange,
        numOfProcessingOrdersForPreviousDateRange
      });
    } catch (e) {
      next(e);
    }

  }
};

module.exports = dashboardController;