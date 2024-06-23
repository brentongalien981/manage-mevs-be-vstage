const { expect } = require("chai");
const Admin = require("../../../src/models/admin");
const authService = require("../../../src/services/authService");
const { generateAdminsWithParams } = require("../../../src/factories/adminFactory");

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


  describe("authService.login", () => {

    it("should return null token if admin email does not exist", async () => {

      // Mock relevant variables.
      const nonExistentCredentials = {
        email: "nonExistent@user.com",
        password: "invalidPassword"
      };

      const mockReq = { body: nonExistentCredentials };


      // Call the service.
      const { email, token } = await authService.login(mockReq);


      // Expect      
      expect(token).to.be.null;
      expect(email).equals(nonExistentCredentials.email);

    });


    it("should return null token if password provdided is not valid", async () => {

      // Generate relevant data.
      const adminProps = {
        email: "valid@email.com",
        password: "validPassword3#"
      };
      await generateAdminsWithParams({ adminProps });

      // Mock relevant variables.
      const credentials = {
        email: adminProps.email,
        password: "invalidPassword"
      };

      const mockReq = { body: credentials };


      // Call the service.
      const { email, token } = await authService.login(mockReq);

      // Query db.
      const admins = await Admin.find();


      // Expect      
      expect(token).to.be.null;
      expect(email).equals(adminProps.email);
      expect(admins.length).equals(1);
      expect(admins[0].email).equals(adminProps.email);

    });

  });

});