const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Order = require("../models/order");
const My = require("../utils/My");
const { generateOrderItems } = require("./orderItemFactory");
const MyDateUtils = require("../utils/MyDateUtils");
const { getRandomOrderStatus } = require("./orderStatusFactory");


async function generateOrdersWithinDateRange({ numItems, startDateStr, endDateStr }) {

  startDateStr += "T00:00:00.000Z";
  endDateStr += "T23:59:59.999Z";
  const items = [];

  // Set the orders' properties.
  for (let i = 0; i < numItems; i++) {
    const randomDateInRange = MyDateUtils.generateRandomDateInRange(startDateStr, endDateStr);
    const customProps = { createdAt: randomDateInRange };
    const item = await prepareRandomOrderObj({ customProps });
    items.push(item);
  }

  // Save the orders to the db.
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


async function prepareRandomOrderObj({ customProps }) {

  const randomNumDaysPassed = My.getRandomNumber(0, 365);
  const randomOrderStatus = await getRandomOrderStatus();

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
    orderStatus: randomOrderStatus.id,
    shippingFee: 499.99,
    createdAt: MyDateUtils.getDate(randomNumDaysPassed),
    ...customProps
  });

  return item;
}





async function generateOrders(numItems = 1, props = {}) {

  const items = [];

  for (let i = 0; i < numItems; i++) {

    const item = await prepareRandomOrderObj({ customProps: props });

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
  generateOrders,
  generateOrdersWithinDateRange
};