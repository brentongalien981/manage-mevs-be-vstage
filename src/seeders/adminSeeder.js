const mongoose = require("mongoose");
const { generateAdminsWithParams } = require("../factories/adminFactory");
const Admin = require("../models/admin");
require('dotenv').config();


async function seedAdmin() {
  const adminProps = {
    email: process.env.DEFAULT_ADMIN_EMAIL,
    password: process.env.DEFAULT_ADMIN_PASSWORD
  };
  await generateAdminsWithParams({ adminProps });
}


async function unseedAdmin() {
  await Admin.deleteMany({});
}


module.exports = {
  seedAdmin,
  unseedAdmin
};