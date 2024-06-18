require("../../setup");
const chai = require("chai");
const Admin = require("../../../src/models/admin");
const My = require("../../../src/utils/My");
const { expect } = chai;


describe("Unit / Models / admin", () => {

  describe("Admin Model - Validations", () => {

    it("should not save an admin without an email", async () => {

      const admin = new Admin({
        password: "random-password",
        signupKey: "fake-signup-key"
      });

      let error = null;
      try {
        await admin.save();
      } catch (e) {
        error = e;
      }

      const queriedAdmins = await Admin.find();

      expect(error).to.exist;
      // expect(error.name).equals("CastError");
      expect(error.name).equals("ValidationError");
      expect(error.errors["email"].message).to.exist;
      expect(queriedAdmins.length).equals(0);

    });


    it("should save an admin with valid properties", async () => {

      const admin = new Admin({
        email: "valid@email.com",
        password: "validPassword#1",
        signupKey: process.env.SIGNUP_KEY
      });

      let error = null;
      try {
        await admin.save();
      } catch (e) {
        error = e;
      }

      const queriedAdmins = await Admin.find();


      expect(process.env.SIGNUP_KEY).to.exist;
      expect(error).to.be.null;
      expect(queriedAdmins.length).equals(1);

    });

  });

});  