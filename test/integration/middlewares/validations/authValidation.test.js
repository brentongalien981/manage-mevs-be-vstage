require("../../../setup");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../../../app");
const spies = require("chai-spies");
const My = require("../../../../src/utils/My");
const MyMultipleValidationErrors = require("../../../../src/errors/MyMultipleValidationErrors");
const { SIGNUP_KEY_EQUALITY_VALIDATION_ERROR_MSG, PASSWORD_REGEX_VALIDATION_ERROR_MSG } = require("../../../../src/utils/validators/UserValidator");

chai.use(chaiHttp);
chai.use(spies);
const expect = chai.expect;


describe("Integration / Middlewares / Validations / authValidation", () => {

  describe("authValidation.signup", () => {

    it("should respond with JSON that has property: multipleErrorsObj if signupKey is invalid", async () => {

      // Make the request.
      const response = await chai.request(app)
        .post("/auth/signup")
        .send({
          email: "valid@email.com",
          password: "validPassword3#",
          signupKey: "invalid-key"
        });


      // Expect
      expect(response).to.have.status(401);
      expect(response.body.multipleErrorsObj).to.exist;
      expect(response.body.multipleErrorsObj.name).equals(MyMultipleValidationErrors.name);
      expect(response.body.multipleErrorsObj.errors[0].msg).equals(SIGNUP_KEY_EQUALITY_VALIDATION_ERROR_MSG);

    });


    it("should not respond with 401 if request has valid signupKey", async () => {

      // Make the request.
      const response = await chai.request(app)
        .post("/auth/signup")
        .send({
          email: "valid@email.com",
          password: "validaPassword3#",
          signupKey: process.env.SIGNUP_KEY
        });


      // Expect
      expect(response).to.not.have.status(401);
      expect(response.body.multipleErrorsObj).to.not.exist;

    });


    it("should respond with JSON that has property: multipleErrorsObj if password is invalid", async () => {

      // Make the request.
      const response = await chai.request(app)
        .post("/auth/signup")
        .send({
          email: "valid@email.com",
          password: "invalid-password",
          signupKey: process.env.SIGNUP_KEY
        });


      // Expect
      expect(response).to.have.status(401);
      expect(response.body.multipleErrorsObj).to.exist;
      expect(response.body.multipleErrorsObj.name).equals(MyMultipleValidationErrors.name);
      expect(response.body.multipleErrorsObj.errors.length).equals(1);

      const errors = response.body.multipleErrorsObj.errors;

      for (const e of errors) {
        if (e.path === "password") {
          expect(e.msg).equals(PASSWORD_REGEX_VALIDATION_ERROR_MSG);
        }
      }

    });


    it("should fail if password is not provided", async () => {

      // Make the request.
      const response = await chai.request(app)
        .post("/auth/signup")
        .send({
          email: "valid@email.com",
          signupKey: process.env.SIGNUP_KEY
        });


      // Expect
      expect(response).to.have.status(401);
      expect(response.body.multipleErrorsObj).to.exist;
      expect(response.body.multipleErrorsObj.name).equals(MyMultipleValidationErrors.name);
      // There should be 3 errors: password required, minLength, and invalid.
      expect(response.body.multipleErrorsObj.errors.length).equals(3);

    });

  });

});