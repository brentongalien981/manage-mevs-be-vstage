const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../../app");
const MyMultipleValidationErrors = require("../../../src/errors/MyMultipleValidationErrors");
const My = require("../../../src/utils/My");
const MyMongooseValidationError = require("../../../src/errors/MyMongooseValidationError");
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


    it("should handle mongoose ValidationError if signup fails", async () => {

      // Admin properties without email
      const newUserParams = {
        password: "validPassword3#",
        signupKey: process.env.SIGNUP_KEY
      };

      // Make the request.
      const response = await chai.request(app).post("/auth/signup").send(newUserParams);

      // Expected error.
      expect(response).to.have.status(401);
      expect(response.body.multipleErrorsObj).to.exist;
      expect(response.body.multipleErrorsObj.name).equals(MyMongooseValidationError.name);
      expect(response.body.multipleErrorsObj.errors.length).equals(1);

    });

  });

});