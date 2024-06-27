const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../../app");
require("../../setup");

chai.use(chaiHttp);
const { expect } = chai;



describe("Integration / Controllers / dashboardController", () => {

  describe("dashboardController.query", () => {

    it("should return 200 if dashboard query is successful", async () => {

      const dashboardParams = {
        rangeStartDateStr: "2024-01-01",
        rangeEndDateStr: "2024-02-16",
        periodFrequency: "Daily",
      };
      const response = await chai.request(app).post("/dashboard/query").send(dashboardParams);

      expect(response).to.have.status(200);
      expect(response.body.ordersDataForCurrentDateRange).to.exist;      
      expect(response.body.ordersDataForPreviousDateRange).to.exist;
      expect(response.body.numOfProcessingOrdersForCurrentDateRange).to.exist;
      expect(response.body.numOfProcessingOrdersForPreviousDateRange).to.exist;

    });


  });


});