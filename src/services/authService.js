const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const authService = {
  signup: async (req) => {
    // Generate bcryptjs salt with 10 rounds.
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newAdmin = await Admin.create({
      email: req.body.email,
      password: hashedPassword
    });

    // Generate JWT token.
    const token = jwt.sign({ email: newAdmin.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return {
      email: newAdmin.email,
      token
    };
  }
};


module.exports = authService;