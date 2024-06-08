const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Order = require("../models/order");
const My = require("../utils/My");
const { generateOrderItems } = require("./orderItemFactory");
const MyDateUtils = require("../utils/MyDateUtils");
const { getRandomOrderStatus } = require("./orderStatusFactory");



async function generateOrders(numItems = 1, props = {}) {

  const items = [];

  for (let i = 0; i < numItems; i++) {

    const randomNumDaysPassed = My.getRandomNumber(0, 365);

    const item = new Order({
      _id: new mongoose.Types.ObjectId(),
      stripePaymentIntentId: faker.string.uuid(),
      shipmentId: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      street1: faker.location.streetAddress(),
      city: faker.location.city(),
      province: faker.location.state({ abbreviated: true }),
      postalCode: faker.location.zipCode(),
      country: faker.location.country(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      orderStatus: (await getRandomOrderStatus()).id,
      shippingFee: 499.99,
      createdAt: MyDateUtils.getDate(randomNumDaysPassed),
      ...props
    });

    items.push(item);

  }

  const allOrders = await Order.insertMany(items);


  // Generate order-items for all the seeded orders.
  for (const o of allOrders) {
    const orderItems = await generateOrderItems(o.id);

    // Extract the order-items ObjectIds.
    const orderItemsObjsIds = orderItems.map((item) => (item.id));

    // Calculate the tax for the order-items.
    const tax = calculateOrderItemsTax(orderItems);

    o.tax = parseFloat(tax.toFixed(2));
    o.orderItems = orderItemsObjsIds;
    await o.save()
  }

  return allOrders;

}


function calculateOrderItemsTax(orderItems) {

  let orderSubtotal = 0;

  orderItems.forEach(i => {
    const itemSubtotal = i.price * i.quantity;
    orderSubtotal += itemSubtotal
  });

  const tax = orderSubtotal * 0.13;
  return tax;
}


module.exports = {
  generateOrders
};