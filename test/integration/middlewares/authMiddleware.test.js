require("../../setup");
const chai = require("chai");
const spies = require("chai-spies");
const authMiddleware = require("../../../src/middlewares/authMiddleware");


chai.use(spies);

const expect = chai.expect;


describe("Integration / Middlewares / authMiddleware", () => {

  describe("authMiddleware.authenticate", () => {

    it("should set req.isLoggedIn to false if no token is provided", async () => {

      // Mock stuffs
      const req = {};
      const res = {};
      const next = () => { };

      // Spy
      const spyNext = chai.spy(next);      

      await authMiddleware.authenticate(req, res, spyNext);

      expect(req.isLoggedIn).to.be.false;
      expect(spyNext).to.have.been.called.once;


    });

  });

});