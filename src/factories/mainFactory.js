const { generateDefaultBrands } = require("./brandFactory");
const { generateDefaultCategories } = require("./categoryFactory");
const { generateDefaultOrderStatuses } = require("./orderStatusFactory");
const { generateDefaultProducts } = require("./productFactory");

async function generateDefaultCollections() {
  await generateDefaultBrands();
  await generateDefaultCategories();
  await generateDefaultOrderStatuses();
  await generateDefaultProducts();
}


module.exports = {
  generateDefaultCollections
};