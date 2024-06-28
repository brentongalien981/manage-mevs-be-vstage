const connectDB = require("../config/db");
const mongoose = require("mongoose");
const { seedBrand } = require("./brandSeeder");
const { seedOrderStatus } = require("./orderStatusSeeder");
const { seedCategory } = require("./categorySeeder");
const { seedProduct } = require("./productSeeder");
const { seedOrder } = require("./orderSeeder");
const { seedAdmin } = require("./adminSeeder");


const seederFuncs = [
  seedBrand,
  seedOrderStatus,
  seedCategory,
  seedProduct,
  seedOrder,
  seedAdmin
];


async function seed() {

  try {

    await connectDB();

    console.log("\n######################################");
    console.log("Seeding all required seeds...");
    console.log("######################################\n");

    for (const f of seederFuncs) {
      console.log(`Running ${f.name} ...`);
      await f();
      console.log(`Success running ${f.name} ...\n`);;
    }


    console.log("\n######################################");
    console.log("Success seeding all required seeds.");
    console.log("######################################\n");

  } catch (e) {
    console.log("\n######################################");
    console.log("Error seeding data: " + e.message);
    console.log("######################################\n");
  }


  mongoose.connection.close();
}


seed();