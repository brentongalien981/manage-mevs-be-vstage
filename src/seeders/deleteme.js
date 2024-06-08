const connectDB = require("../config/db");
const { default: mongoose } = require("mongoose");
const products = require("../data/dummy-products.json");
const Brand = require("../models/brand");
const OrderStatus = require("../models/orderStatus");
const { faker } = require("@faker-js/faker");
const My = require("../utils/My");

async function runMe() {

  await connectDB();

  for (const p of products) {
    console.log(`${p.name} ==> $${p.price}`);

    const brand = await Brand.findOne({ name: p.brand });
    // const brand = await Brand.findOne({});

    console.log(`\t${brand.name}: ${brand.id}`);
  }

  mongoose.connection.close();
}



async function runMe2() {
  await connectDB();

  const brand = await Brand.findOne();
  My.log(`brand.id ==> ${brand.id}`);
  My.log(`brand._id ==> ${brand._id}`);
  My.log(`typeof brand.id ==> ${typeof brand.id}`);
  My.log(`typeof brand._id ==> ${typeof brand._id}`);

  mongoose.connection.close();
}


function runMe3() {
  const uuid = faker.string.uuid();
  // const regularObjectId = new mongoose.Types.ObjectId(uuid);
  const hashedObjectId = My.uuidToObjectId(uuid);

  My.log(`uuid ==> ${uuid}`);
  My.log(`hashedObjectId ==> ${hashedObjectId}`);
}


runMe2();
// runMe3();
