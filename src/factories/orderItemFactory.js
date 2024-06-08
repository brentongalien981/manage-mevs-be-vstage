const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Product = require("../models/product");
const My = require("../utils/My");
const { getRandomProduct } = require("./productFactory");
const OrderItem = require("../models/orderItem");

async function generateOrderItems(orderId) {

  const probableNumItems = My.getRandomNumber(1, 5);
  const alreadyUsedProductIds = [];
  const items = [];

  for (let i = 0; i < probableNumItems; i++) {
    
    const product = await getRandomProduct();
    const isProductAlreadyReferenced = alreadyUsedProductIds.includes(product.id);

    if (isProductAlreadyReferenced) {
      continue;
    }

    alreadyUsedProductIds.push(product.id);

    items.push({
      _id: new mongoose.Types.ObjectId(),
      order: orderId,
      product: product.id,
      quantity: My.getRandomNumber(1, 6),
      price: product.price
    });
    
  }

  return await OrderItem.insertMany(items);  

}


module.exports = {
  generateOrderItems
};