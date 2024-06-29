const { expect } = require("chai");
const { generateOrders, generateOrdersWithinDateRange } = require("../../../src/factories/orderFactory");
const MyDateUtils = require("../../../src/utils/MyDateUtils");
const Order = require("../../../src/models/order");
const { generateDefaultCollections } = require("../../../src/factories/mainFactory");
const My = require("../../../src/utils/My");
const { dashboardService, reduceOrdersData, getNumOfProcessingOrdersFromOrdersData } = require("../../../src/services/dashboardService");
const OrderStatus = require("../../../src/models/orderStatus");
require("../../setup");



describe("Integration / Service / dashboardService", () => {

  describe("dashboardService.query", () => {

    it("should return orders data for current and previous date ranges", async () => {

      // Generate relevant objects.
      await generateDefaultCollections();

      // Mock relevant variables.
      const dashboardParmas = {
        rangeStartDateStr: "2024-01-01",
        rangeEndDateStr: "2024-02-16",
        periodFrequency: "Daily",
      };

      // Generate orders within current date range.
      const ordersWithinCurrentRange = await generateOrdersWithinDateRange({ numItems: 50, startDateStr: dashboardParmas.rangeStartDateStr, endDateStr: dashboardParmas.rangeEndDateStr });

      // Generate orders within previous date range.
      const prevRangeStartDateStr = MyDateUtils.getDateStringWithOffset(new Date(dashboardParmas.rangeStartDateStr), -365);
      const prevRangeEndDateStr = MyDateUtils.getDateStringWithOffset(new Date(dashboardParmas.rangeEndDateStr), -365);
      const ordersWithinPreviousRange = await generateOrdersWithinDateRange({ numItems: 10, startDateStr: prevRangeStartDateStr, endDateStr: prevRangeEndDateStr });

      // Generate orders that has edge cases dates within previous date range.
      const ordersWithEdgeCasePrevRange1 = await generateOrders(5, { createdAt: prevRangeStartDateStr + "T00:00:00.000Z" });
      const ordersWithEdgeCasePrevRange2 = await generateOrders(5, { createdAt: prevRangeEndDateStr + "T23:59:59.999Z" });

      // Mock relevant variables.
      const mockReq = {
        body: { ...dashboardParmas }
      };

      // Call the service.
      const { ordersDataForCurrentDateRange, ordersDataForPreviousDateRange } = await dashboardService.query(mockReq);

      // Query db for other data.
      const allOrders = await Order.find();


      // Expect
      expect(allOrders.length).equals(ordersWithinCurrentRange.length + ordersWithinPreviousRange.length + ordersWithEdgeCasePrevRange1.length + ordersWithEdgeCasePrevRange2.length);
      expect(ordersDataForCurrentDateRange.length).equals(ordersWithinCurrentRange.length);
      expect(ordersDataForPreviousDateRange.length).equals(ordersWithinPreviousRange.length + ordersWithEdgeCasePrevRange1.length + ordersWithEdgeCasePrevRange2.length);


    });

  });


  describe("dashboardService.getNumOfProcessingOrdersFromOrdersData", () => {

    it("should return the number of orders with ORDER_PROCESSING status from orders data", async () => {

      // Generate relevant objects.
      await generateDefaultCollections();
      const processingOrderStatus = await OrderStatus.findOne({ name: "ORDER_PROCESSING" });
      const orderFailedStatus = await OrderStatus.findOne({ name: "ORDER_FAILED" })

      // Generate orders with different statuses.
      const ordersWithRandomOrderStatus = await generateOrders(10);
      const ordersWithProcessingOrderStatus = await generateOrders(10, { orderStatus: processingOrderStatus._id });
      const ordersWithOrderFailedStatus = await generateOrders(10, { orderStatus: orderFailedStatus._id });


      // Query db for all orders.
      const allOrders = await Order.find();
      const ordersData = await reduceOrdersData(allOrders);

      // Call the service.
      const numOfProcessingOrders = await getNumOfProcessingOrdersFromOrdersData(ordersData);


      // Expect
      expect(numOfProcessingOrders).to.be.lessThan(allOrders.length);
      expect(numOfProcessingOrders).greaterThanOrEqual(ordersWithProcessingOrderStatus.length);
      expect(numOfProcessingOrders).lessThanOrEqual(ordersWithProcessingOrderStatus.length + ordersWithRandomOrderStatus.length);
    });

  });


  describe("dashboardService.reduceOrdersData", () => {

    it("should return an array of reduced orders data", async () => {

      // Generate relevant objects.
      await generateDefaultCollections();
      const orders = await generateOrders(10);
      const reducedOrdersData = await reduceOrdersData(orders);

      for (const order of reducedOrdersData) {
        // Expect these (and other) properties to be removed.
        expect(order.id).to.be.undefined;
        expect(order.firstName).to.be.undefined;
        expect(order.orderStatus).to.be.undefined;

        // Expect these properties to be present.
        expect(order.createdAt).to.exist;
        expect(order.statusName).to.exist;
        expect(order.totalAmount).to.exist;
        expect(order.country).to.exist;
      }

    });

  });

});