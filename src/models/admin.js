const mongoose = require("mongoose");
const { emailMinLengthValidator, emailMaxLengthValidator, emailValidators } = require("../utils/validators/UserValidator");


const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: emailMinLengthValidator(),
    maxLength: emailMaxLengthValidator(),
    validate: emailValidators
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 8
  }
}, { timestamps: true });


const Admin = mongoose.model("Admin", adminSchema);


module.exports = Admin;