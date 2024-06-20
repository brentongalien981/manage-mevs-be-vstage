const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../../app");
require("../../setup");

chai.use(chaiHttp);
const { expect } = chai;



describe("Integration / Controllers / authController", () => {

  describe("authController.signup", () => {

    it("should return 201 if signup is successful", async () => {

      const newUserParams = {
        email: "a@b.com",
        password: "validPassword3#",
        signupKey: process.env.SIGNUP_KEY
      };
      const response = await chai.request(app).post("/auth/signup").send(newUserParams);

      expect(response).to.have.status(201);
      expect(response.body.token).to.exist;
      expect(response.body.email).to.exist;

    });

  });

});