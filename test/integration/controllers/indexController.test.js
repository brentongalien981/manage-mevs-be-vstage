const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../../app");


require("../../setup");

chai.use(chaiHttp);
const { expect } = chai;



describe("Integration / Controllers / indexController", () => {

  describe("indexController.home", () => {

    it("should return 200", async () => {

      const response = await chai.request(app).get("/");

      expect(response).to.have.status(200);
      expect(response.body.msg).to.equal("Request OK for GET route: /");

    });

  });

});