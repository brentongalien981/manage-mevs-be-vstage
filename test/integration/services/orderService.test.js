const chai = require("chai");
const { generateDefaultCollections } = require("../../../src/factories/mainFactory");
const { generateOrders } = require("../../../src/factories/orderFactory");
const Order = require("../../../src/models/order");
const My = require("../../../src/utils/My");
const orderService = require("../../../src/services/orderService");
const { getRandomOrderStatus } = require("../../../src/factories/orderStatusFactory");
const OrderStatus = require("../../../src/models/orderStatus");
const { buildSortFilter } = require("../../../src/services/orderService");
const OrderItem = require("../../../src/models/orderItem");
require("../../setup");
const { expect } = chai;



describe("Integration / Services / orderService", () => {


  describe("orderService.buildOrderQueryFilter", () => {

    it("should build query filter based on request order query filters", async () => {

      // Mocks
      const orderFilters = [
        { name: "orderId", value: "fake-order-id-123", sortOrder: "none" },
        { name: "userId", value: "fake-user-id-456", sortOrder: "none" },
        { name: "firstName", value: "John", sortOrder: "none" },
        { name: "city", value: "Boston", sortOrder: "none" },
      ];


      // Call the service.
      const builtQueryFilter = await orderService.buildOrderQueryFilter(orderFilters);


      // Expect
      const firstNameRegex = new RegExp("John", "i");
      expect(builtQueryFilter._id).equals("fake-order-id-123");
      expect(builtQueryFilter.firstName.toString()).equals(firstNameRegex.toString());

      // Assert all properties.
      orderFilters.forEach(filter => {

        const filterName = filter.name;
        const filterValue = filter.value;

        if (filterName === "orderId") {
          // For order-id, just compare the plain value and not a regex value.
          expect(builtQueryFilter._id).equals("fake-order-id-123");
        } else {
          const filterRegexValue = new RegExp(filterValue, "i");

          expect(builtQueryFilter[filterName].toString()).equals(filterRegexValue.toString());
        }
      });

    });


    it("should omit the order-id filter if it is empty when building query filter", async () => {

      // Mocks
      const orderFilters = [
        { name: "orderId", value: "", sortOrder: "none" },
        { name: "firstName", value: "John", sortOrder: "none" },
      ];


      // Call the service.
      const builtQueryFilter = await orderService.buildOrderQueryFilter(orderFilters);


      // Expect
      const firstNameRegex = new RegExp("John", "i");
      expect(builtQueryFilter._id).to.be.undefined;
      expect(builtQueryFilter.firstName.toString()).equals(firstNameRegex.toString());

    });


    it("should add the createdAt property when building the order query filter", async () => {

      // Mocks
      const orderFilters = [
        { name: "firstName", value: "John", sortOrder: "none" },
        { name: "orderDateStart", value: "2024-01-01", sortOrder: "none" },
        { name: "orderDateEnd", value: "2024-01-05", sortOrder: "none" },
      ];


      // Call the service.
      const builtQueryFilter = await orderService.buildOrderQueryFilter(orderFilters);


      // Expect
      expect(builtQueryFilter.createdAt.$gte).equals("2024-01-01");
      expect(builtQueryFilter.createdAt.$lte).equals("2024-01-05");

    });

  });


  describe("orderService.queryOrders", () => {

    it("should return orders based on given order filters", async () => {

      // Generate relevant objects.
      await generateDefaultCollections();
      const generatedOrders = await generateOrders(10);
      const randomOrder = generatedOrders[0];


      // Mocks
      const mockReqQueryObj = {
        ordersFilters: [
          { name: "orderId", value: randomOrder.id, sortOrder: "none" },
          { name: "stripePaymentIntentId", value: randomOrder.stripePaymentIntentId, sortOrder: "none" },
          { name: "firstName", value: randomOrder.firstName, sortOrder: "none" },
          { name: "city", value: randomOrder.city, sortOrder: "none" },
        ],
        pageNavigatorData: { page: 1, numPages: 73 }
      };


      // Call the service.
      const queriedOrders = await orderService.queryOrders(mockReqQueryObj);


      // Query other stuffs.
      const numAllOrders = await Order.countDocuments({});


      // Expect
      expect(numAllOrders).to.equal(10);
      expect(queriedOrders.length).equals(1);
      expect(queriedOrders[0].id).equals(randomOrder.id);
      expect(queriedOrders[0].firstName).equals(randomOrder.firstName);
      expect(queriedOrders[0].city).equals(randomOrder.city);

    });


    it("should return orders based on filter substrings", async () => {

      // Generate relevant objects.
      await generateDefaultCollections();
      await generateOrders(10);
      let generatedOrders = await generateOrders(1, {
        firstName: "fake-name1",
        city: "fake-city1"
      });
      const randomOrder1 = generatedOrders[0];


      // Mocks
      const firstNameSubstr = randomOrder1.firstName.substring(2, 7); // substring ...ke-na... from fake-name
      const citySubstr = randomOrder1.city.substring(1, 8); // substring ..ake-cit... from fake-city

      const mockReqQueryObj = {
        ordersFilters: [
          { name: "firstName", value: firstNameSubstr, sortOrder: "none" },
          { name: "city", value: citySubstr, sortOrder: "none" },
        ],
        pageNavigatorData: { page: 1 }
      };


      // Call the service.s
      const queriedOrders = await orderService.queryOrders(mockReqQueryObj);


      // Query other stuffs.
      const numAllOrders = await Order.countDocuments({});


      // Expect
      expect(numAllOrders).to.equal(11);
      expect(queriedOrders.length).equals(1);
      expect(queriedOrders[0].firstName).equals(randomOrder1.firstName);
      expect(queriedOrders[0].city).equals(randomOrder1.city);

    });


    it("should return orders based on filters with empty value", async () => {

      // Generate relevant objects.
      await generateDefaultCollections();
      await generateOrders(10);


      // Mocks
      const mockReqQueryObj = {
        ordersFilters: [
          { name: "firstName", value: "", sortOrder: "none" },
          { name: "city", value: "", sortOrder: "none" },
        ],
        pageNavigatorData: { page: 1 }
      };


      // Call the service.s
      const queriedOrders = await orderService.queryOrders(mockReqQueryObj);


      // Query other stuffs.
      const numAllOrders = await Order.countDocuments({});


      // Expect
      expect(numAllOrders).to.equal(10);
      expect(queriedOrders.length).equals(10);

    });


    it("should return orders based on order-status filter", async () => {

      // Generate relevant objects.
      await generateDefaultCollections();
      await generateOrders(20);

      const orderStatusForPaymentReceived = (await OrderStatus.find({ name: "PAYMENT_RECEIVED" }))[0];

      // Generate 3 orders with order-status: PAYMENT_RECEIVED
      await generateOrders(3, {
        orderStatus: orderStatusForPaymentReceived._id
      });


      // Mocks
      const mockReqQueryObj = {
        ordersFilters: [
          { name: "city", value: "", sortOrder: "none" },
          { name: "orderStatus", value: orderStatusForPaymentReceived.value, sortOrder: "none" },
        ],
        pageNavigatorData: { page: 1 }
      };


      // Call the service.s
      const queriedOrders = await orderService.queryOrders(mockReqQueryObj);


      // Query other stuffs.
      const numAllOrders = await Order.countDocuments({});


      // Expect
      expect(numAllOrders).to.equal(23);
      expect(queriedOrders.length).to.be.greaterThanOrEqual(3);

      queriedOrders.forEach(order => {
        expect(order.orderStatus.name).equals(orderStatusForPaymentReceived.name);
        expect(order.orderStatus.value).equals(orderStatusForPaymentReceived.value);
      });

    });


    it("should return orders based on orderDateStart and orderDateEnd filters", async () => {

      // Generate relevant objects.
      await generateDefaultCollections();

      const orderDateStart = "2024-01-01";
      const orderDateEnd = "2024-01-05";
      const excludedDate1 = "2023-12-31";
      const excludedDate2 = "2024-01-06";

      // Generate 3 orders with createdAt dates with orderDateStart.
      await generateOrders(3, {
        createdAt: new Date(orderDateStart)
      });
      // Generate 3 orders with createdAt dates with orderDateEnd.
      await generateOrders(3, {
        createdAt: new Date(orderDateEnd)
      });
      // Generate 10 orders with excludedDate1.
      await generateOrders(10, {
        createdAt: new Date(excludedDate1)
      });
      // Generate 10 orders with excludedDate2.
      await generateOrders(10, {
        createdAt: new Date(excludedDate2)
      });


      // Mocks
      const mockReqQueryObj = {
        ordersFilters: [
          { name: "city", value: "", sortOrder: "none" },
          { name: "orderDateStart", value: orderDateStart, sortOrder: "none" },
          { name: "orderDateEnd", value: orderDateEnd, sortOrder: "none" },
        ],
        pageNavigatorData: { page: 1 }
      };


      // Call the service.s
      const queriedOrders = await orderService.queryOrders(mockReqQueryObj);


      // Query other stuffs.
      const numAllOrders = await Order.countDocuments({});


      // Expect
      expect(numAllOrders).to.equal(26);
      expect(queriedOrders.length).equals(6);
    });


    it("should return orders with populated orderStatus property", async () => {

      // Generate relevant objects.
      await generateDefaultCollections();
      await generateOrders(20);
      const randomOrderStatus = await getRandomOrderStatus();
      // Generate some orders with orderStatus equal to randomOrderStatus.
      await generateOrders(3, {
        orderStatus: randomOrderStatus._id
      });


      // Mocks
      const mockReqQueryObj = {
        ordersFilters: [
          { name: "orderStatus", value: randomOrderStatus.value, sortOrder: "none" },
          { name: "city", value: "", sortOrder: "none" },
        ],
        pageNavigatorData: { page: 1 }
      };


      // Call the service.s
      const queriedOrders = await orderService.queryOrders(mockReqQueryObj);


      // Expect
      expect(queriedOrders.length).to.be.greaterThanOrEqual(3);

      queriedOrders.forEach(order => {
        expect(order.orderStatus).to.not.be.null;
        expect(order.orderStatus.name).equals(randomOrderStatus.name);
        expect(order.orderStatus.value).equals(randomOrderStatus.value);
      });
    });


    it("should return orders based on page-number filter", async () => {

      // Generate relevant objects.
      await generateDefaultCollections();
      // Generate 12 orders with firstName as "John".
      await generateOrders(12, { firstName: "John" });
      // Generate 8 orders with firstName as "Chris".
      await generateOrders(8, { firstName: "Chris" });


      // Mocks
      const firstNameFilterPhrase = "Jo";
      const pageNum = 2;
      const mockReqQueryObj = {
        ordersFilters: [
          { name: "firstName", value: firstNameFilterPhrase, sortOrder: "none" },
          { name: "city", value: "", sortOrder: "none" },
        ],
        pageNavigatorData: { page: pageNum }
      };


      // Call the service.s
      const queriedOrders = await orderService.queryOrders(mockReqQueryObj);


      // Query other stuffs.
      const numAllOrders = await Order.countDocuments({});


      // Expect
      expect(numAllOrders).to.equal(20);
      // Expect that querying for orders with firstNameFilter "Jo" and pageNum = 2 returns only 2 orders.
      expect(queriedOrders.length).equals(2);

      queriedOrders.forEach(order => {
        expect(order.firstName).equals("John");
      });

    });


    it("should return orders based on sort filters data", async () => {

      // Mock stuffs and generate relevant objects.
      await generateDefaultCollections();
      await generateOrders(20);
      // Generate 5 order with firstName as "John" and city as something to be compared by order.
      const mockFirstName = "John";
      await generateOrders(1, { firstName: mockFirstName, city: "fake-city-a" });
      await generateOrders(1, { firstName: mockFirstName, city: "fake-city-b" });
      await generateOrders(1, { firstName: mockFirstName, city: "fake-city-c" });
      await generateOrders(1, { firstName: mockFirstName, city: "fake-city-d" });
      await generateOrders(1, { firstName: mockFirstName, city: "fake-city-e" });


      const mockReqQueryObj = {
        ordersFilters: [
          { name: "firstName", value: mockFirstName },
          { name: "city", value: "ake-city" },
        ],
        pageNavigatorData: { page: 1 },
        sortFilters: [
          { name: "firstName", sortOrder: "ascending" },
          { name: "city", sortOrder: "descending" },
        ]
      };


      // Call the service.
      const queriedOrders = await orderService.queryOrders(mockReqQueryObj);

      // Query other stuffs.
      const numAllOrders = await Order.countDocuments({});


      // Expect
      expect(numAllOrders).to.equal(25);
      expect(queriedOrders.length).equals(5);

      for (let i = 0; i < queriedOrders.length; i++) {
        const currentOrder = queriedOrders[i];

        if (i === 0) {
          continue;
        }

        const previousOrder = queriedOrders[i - 1];

        let myBool = currentOrder.firstName >= previousOrder.firstName;
        expect(myBool).equals(true); // ascending

        myBool = currentOrder.city < previousOrder.city;
        expect(myBool).equals(true); // descending

      }

    });

  });


  describe("orderService.getOrdersCountWithFilters", () => {

    it("should return the count of orders based on given order filters", async () => {

      // Generate relevant objects.
      await generateDefaultCollections();
      // Generate 12 orders with firstName as "John".
      await generateOrders(12, { firstName: "John" });
      // Generate 8 orders with firstName as "Chris".
      await generateOrders(8, { firstName: "Chris" });


      // Mocks
      const firstNameFilterPhrase = "Jo";
      const ordersFilters = [
        { name: "firstName", value: firstNameFilterPhrase, sortOrder: "none" },
        { name: "city", value: "", sortOrder: "none" },
      ];


      // Call the service.s
      const count = await orderService.getOrdersCountWithFilters(ordersFilters);


      // Query other stuffs.
      const numAllOrders = await Order.countDocuments({});


      // Expect
      expect(numAllOrders).to.equal(20);
      expect(count).equals(12);

    });

  });


  describe("orderService.buildSortFilter", () => {

    it("should build sort filter based on sort filters data", () => {

      // Mock stuffs
      const mockSortFiltersData = [
        { name: "_id", sortOrder: "ascending" },
        { name: "firstName", sortOrder: "descending" },
        { name: "city", sortOrder: "ascending" },
      ];


      // Call the function.
      const builtSortFilter = buildSortFilter(mockSortFiltersData);


      // Assert for the rest of the filters.
      for (const aMockSortFilter of mockSortFiltersData) {

        const filterName = aMockSortFilter.name;
        const filterSortValue = aMockSortFilter.sortOrder === "ascending" ? 1 : -1;
        expect(builtSortFilter[filterName]).equals(filterSortValue);
      }

    });


    it("should build a sort filter with overriden createdAt property if provided", () => {

      // Mock stuffs
      const mockSortFiltersData = [
        { name: "_id", sortOrder: "ascending" },
        { name: "firstName", sortOrder: "descending" },
        { name: "createdAt", sortOrder: "descending" },
        { name: "city", sortOrder: "ascending" },
      ];


      // Call the function.
      const builtSortFilter = buildSortFilter(mockSortFiltersData);


      // Expect the "createdAt" filter was overriden to -1.
      expect(builtSortFilter.createdAt).equals(-1);
      // Assert for the rest of the filters.
      for (const aMockSortFilter of mockSortFiltersData) {

        const filterName = aMockSortFilter.name;
        const filterSortValue = aMockSortFilter.sortOrder === "ascending" ? 1 : -1;
        expect(builtSortFilter[filterName]).equals(filterSortValue);
      }

    });

  });


  describe("orderService.calculateTotalAmount", () => {

    it("should calculate the total amount of an order", async () => {

      // Generate relevant objects.
      await generateDefaultCollections();
      const generatedOrders = await generateOrders(5);

      // Loop through the generated orders.
      for (const generatedOrder of generatedOrders) {

        // Query the order.
        const queriedOrder = await Order.findById(generatedOrder.id).populate("orderItems");

        // Calculate the total of queriedOrder.
        let subtotal = 0;
        for (const orderItem of queriedOrder.orderItems) {
          subtotal += (orderItem.price * orderItem.quantity);
        }
        let total = (subtotal + queriedOrder.shippingFee) * (1 + orderService.TAX_RATE);
        total = parseFloat(total.toFixed(2));


        // Call the service.
        let calculatedTotalAmount = await orderService.calculateTotalAmount(generatedOrder);
        calculatedTotalAmount = parseFloat(calculatedTotalAmount.toFixed(2));

        // Expect 
        expect(total).equals(calculatedTotalAmount);
      }
    });

  });

});