const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Product = require("../models/product");
const My = require("../utils/My");
const dummyProducts = require("../data/dummy-products.json");
const Brand = require("../models/brand");
const Category = require("../models/category");


async function generateDefaultProducts(numItems = 1) {

  const modifiedDummyProducts = [];

  for (const p of dummyProducts) {

    // Reference the brand obj of the product's brand.
    const brand = await Brand.findOne({ name: p.brand });

    // Reference the category obj of the product's category.
    const category = await Category.findOne({ name: p.category });

    // Modify the product's brand and category properties by using ids instead of names.    
    modifiedDummyProducts.push({
      ...p,
      _id: new mongoose.Types.ObjectId(),
      brand: brand.id,
      category: category.id,
      description: p.description ?? "",
      quantity: p.quantity ?? 0
    });

  }


  await Product.insertMany(modifiedDummyProducts);

}


async function getRandomProduct() {
  const allProducts = await Product.find();
  const randomNum = My.getRandomNumber(0, allProducts.length - 1);
  return allProducts[randomNum];
}


module.exports = {
  generateDefaultProducts,
  getRandomProduct
};