const { expect } = require("chai");
const Admin = require("../../../src/models/admin");
const authService = require("../../../src/services/authService");

require("../../setup");



describe("Integration / Service / authService", () => {

  describe("authService.signup", () => {

    it("should save a new admin to db", async () => {

      // Mock relevant variables.
      const newAdminProps = {
        email: "a@b.com",
        password: "validPassword3#"
      };

      const mockReq = { body: newAdminProps };

      // Call the service.
      await authService.signup(mockReq);

      // Query db.
      const admins = await Admin.find();
      const theAdmin = admins[0];

      // Expect that the admin is saved in db.
      expect(admins.length).to.equal(1);
      expect(theAdmin.email).equals(newAdminProps.email);

    });


    it("should return a token and email when signup is successful", async () => {

      // Mock relevant variables.
      const newAdminProps = {
        email: "a@b.com",
        password: "validPassword3#"
      };

      const mockReq = { body: newAdminProps };

      // Call the service.
      const { token, email } = await authService.signup(mockReq);

      // Expect
      expect(token.length).to.be.greaterThan(1);
      expect(email).equals(newAdminProps.email);

    });

  });

});