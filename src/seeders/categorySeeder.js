const mongoose = require("mongoose");
const Category = require("../models/category");
const { generateDefaultCategories } = require("../factories/categoryFactory");


async function seedCategory() {
  await generateDefaultCategories();
}


async function unseedCategory() {
  await Category.deleteMany({});
}


module.exports = {
  seedCategory,
  unseedCategory
};