const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../../app");
const MyMultipleValidationErrors = require("../../../src/errors/MyMultipleValidationErrors");
const My = require("../../../src/utils/My");
const MyMongooseValidationError = require("../../../src/errors/MyMongooseValidationError");
const AuthenticationError = require("../../../src/errors/AuthenticationError");
const { generateAdminsWithParams } = require("../../../src/factories/adminFactory");
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


  describe("authController.login", () => {

    it("should return 401 if admin tries to login with non-existend email", async () => {

      // Define relevant variables.
      const invalidCredentials = {
        email: "a@b.com",
        password: "validPassword3#"
      };

      // Make the request.
      const response = await chai.request(app).post("/auth/login").send(invalidCredentials);

      // Expect
      const expectedError = new AuthenticationError();
      expect(response).to.have.status(expectedError.status);
      expect(response.body.error.friendlyErrorMessage).equals(expectedError.friendlyErrorMessage);

    });


    it("should return 200 if login is successful", async () => {

      // Generate relevant data.
      const adminProps = {
        email: "valid@email.com",
        password: "validPassword3#"
      };
      await generateAdminsWithParams({ adminProps });

      // Make the request.
      const response = await chai.request(app).post("/auth/login").send(adminProps);

      // Expect
      expect(response).to.have.status(200);
      expect(response.body.token).to.exist;
      expect(response.body.email).to.exist;

    });

  });

});