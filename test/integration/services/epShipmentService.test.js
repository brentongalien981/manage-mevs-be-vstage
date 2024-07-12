require("../../setup");
const { expect } = require("chai");
const My = require("../../../src/utils/My");
const { generateDefaultCollections } = require("../../../src/factories/mainFactory");
const { generateOrders } = require("../../../src/factories/orderFactory");
const epShipmentService = require("../../../src/services/epShipmentService");
const Order = require("../../../src/models/order");



describe("Integration / Service / epShipmentService", () => {

  describe("epShipmentService.buyShippingLabel", () => {

    it("should buy an EasyPost shipping label", async () => {

      // Generate relevant objects.
      await generateDefaultCollections();
      const generatedOrders = await generateOrders(1);
      const randomOrder = generatedOrders[0];
      

      // Mock relevant variables.
      const mockReq = {
        body: {
          orderId: randomOrder.id
        }
      };


      // Call the service.
      const response = await epShipmentService.buyShippingLabel(mockReq);

      // Query the order.
      const queriedOrder = await Order.findById(randomOrder.id);


      // Expect
      expect(randomOrder.id).equals(queriedOrder.id);
      expect(response.shipmentId).to.exist;
      expect(response.shipmentPostageLabelUrl).to.exist;
      expect(response.shipmentTrackerUrl).to.exist;

    });


  });

});