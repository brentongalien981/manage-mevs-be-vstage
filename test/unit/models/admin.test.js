require("../../setup");
const chai = require("chai");
const Admin = require("../../../src/models/admin");
const My = require("../../../src/utils/My");
const { generateAdmins } = require("../../../src/factories/adminFactory");
const MyMongooseValidationError = require("../../../src/errors/MyMongooseValidationError");
const { expect } = chai;


describe("Unit / Models / admin", () => {

  describe("Admin Model - Validations", () => {

    it("should not save an admin without an email", async () => {

      const admin = new Admin();

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

      const admin = (await generateAdmins(1))[0];

      let error = null;
      try {
        await admin.save();
      } catch (e) {
        error = e;
      }

      const queriedAdmins = await Admin.find();


      expect(error).to.be.null;
      expect(queriedAdmins.length).equals(1);

    });

  });

});  