const mongoose = require("mongoose");
const Brand = require("../models/brand");
const { generateDefaultBrands } = require("../factories/brandFactory");


async function seedBrand() {
  await generateDefaultBrands();
}


async function unseedBrand() {
  await Brand.deleteMany({});
}


module.exports = {
  seedBrand,
  unseedBrand
};