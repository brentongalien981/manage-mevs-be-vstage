const connectDB = require("../config/db");
const mongoose = require("mongoose");
const { unseedBrand } = require("./brandSeeder");
const { unseedOrderStatus } = require("./orderStatusSeeder");
const { unseedCategory } = require("./categorySeeder");
const { unseedProduct } = require("./productSeeder");
const { unseedOrder } = require("./orderSeeder");


const unseedFuncs = [
  unseedBrand,
  unseedOrderStatus,
  unseedCategory,
  unseedProduct,
  unseedOrder,
];


async function rollback() {

  try {
    await connectDB();

    console.log("\n######################################");
    console.log("Rolling back all required seeds...");
    console.log("######################################\n");

    for (const f of unseedFuncs) {
      console.log(`Running ${f.name} ...`);
      await f();
      console.log(`Success running ${f.name} ...\n`);;
    }


    console.log("\n######################################");
    console.log("Success unseeding all required data.");
    console.log("######################################\n");

  } catch (e) {
    console.log("\n######################################");
    console.log("Error rolling back seeds: " + e.message);
    console.log("######################################\n");
  }


  mongoose.connection.close();
}


rollback();