const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const bcryptjs = require("bcryptjs");
const Admin = require("../models/admin");

async function generateAdmins(numItems = 1) {

  const items = [];

  for (let i = 0; i < numItems; i++) {

    items.push({
      _id: new mongoose.Types.ObjectId(),
      email: faker.internet.email(),
      password: await generateHashedPassword()
    });

  }

  return await Admin.insertMany(items);

}


async function generateHashedPassword() {

  // Generate bcryptjs salt with 10 rounds.
  const salt = await bcryptjs.genSalt(10);

  const password = faker.internet.password();
  const hashedPassword = await bcryptjs.hash(password, salt);

  return hashedPassword;
}


async function hashPassword(value) {

  // Generate bcryptjs salt with 10 rounds.
  const salt = await bcryptjs.genSalt(10);

  const password = value ?? faker.internet.password();
  const hashedPassword = await bcryptjs.hash(password, salt);

  return hashedPassword;
}


async function generateAdminsWithParams({ numItems = 1, adminProps }) {
  const items = [];

  for (let i = 0; i < numItems; i++) {

    items.push({
      _id: new mongoose.Types.ObjectId(),
      email: adminProps.email ?? faker.internet.email(),
      password: await hashPassword(adminProps.password)
    });

  }

  return await Admin.insertMany(items);
}


module.exports = {
  generateAdmins,
  generateAdminsWithParams
};