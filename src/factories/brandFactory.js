const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Brand = require("../models/brand");


const initialBrands = [
  { name: "BMW", description: "", isActive: true },
  { name: "Mercedes-Benz", description: "", isActive: true },
  { name: "Tesla", description: "", isActive: true },
  { name: "Toyota", description: "", isActive: true },
  { name: "Honda", description: "", isActive: true },
  { name: "Nissan", description: "", isActive: true },
  { name: "Subaru", description: "", isActive: true },
  { name: "Mitsubishi", description: "", isActive: true },
  { name: "GMC", description: "", isActive: true },
  { name: "Ford", description: "", isActive: true },
  { name: "Bosche", description: "", isActive: true },
  { name: "BaFang", description: "", isActive: true },
  { name: "Shimano", description: "", isActive: true },
];


async function generateDefaultBrands(numItems = 1) {

  const items = [];

  for (let i = 0; i < initialBrands.length; i++) {

    const item = new Brand({
      ...initialBrands[i],
      _id: new mongoose.Types.ObjectId(),      
    });

    items.push(item);

  }

  await Brand.insertMany(items);

}


module.exports = {
  generateDefaultBrands
};