const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Category = require("../models/category");


const initialCategories = [
  { name: "E-vehicle", description: "", isActive: true },
  { name: "E-car", description: "", isActive: true },
  { name: "E-truck", description: "", isActive: true },
  { name: "E-bike", description: "", isActive: true },
  { name: "E-scooter", description: "", isActive: true },
];


async function generateDefaultCategories(numItems = 1) {

  const items = [];

  for (let i = 0; i < initialCategories.length; i++) {

    const item = new Category({
      ...initialCategories[i],
      _id: new mongoose.Types.ObjectId(),      
    });

    items.push(item);

  }

  await Category.insertMany(items);

}


module.exports = {
  generateDefaultCategories
};