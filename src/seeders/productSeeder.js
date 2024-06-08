const Product = require("../models/product");
const { generateDefaultProducts } = require("../factories/productFactory");


async function seedProduct() {
  await generateDefaultProducts();
}


async function unseedProduct() {
  await Product.deleteMany({});
}


module.exports = {
  seedProduct,
  unseedProduct
};