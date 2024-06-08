const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
// const app = require("../app");


let server;
let mongod;


before(async () => {
  // server = app.listen(0, () => { });
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`\n#########################################`);
  console.log("Connected to mongodb-memory-server...");
  console.log(`#########################################\n`);
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
  // await server.close();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});