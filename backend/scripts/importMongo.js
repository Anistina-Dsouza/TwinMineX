require("dotenv").config();

const { MongoClient } = require("mongodb");
const fs = require("fs");

async function importData() {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();

    const db = client.db("mineDigitalTwin");

    const routes = JSON.parse(
      fs.readFileSync("./output/normalizedRoutes.json", "utf8")
    );

    const trucks = JSON.parse(
      fs.readFileSync("./output/trucks.json", "utf8")
    );

    const towers = JSON.parse(
      fs.readFileSync("./output/towers.json", "utf8")
    );

    await db.collection("routes").deleteMany({});
    await db.collection("trucks").deleteMany({});
    await db.collection("towers").deleteMany({});

    await db.collection("routes").insertMany(routes);
    await db.collection("trucks").insertMany(trucks);
    await db.collection("towers").insertMany(towers);

    console.log("Routes:", routes.length);
    console.log("Trucks:", trucks.length);
    console.log("Towers:", towers.length);

    console.log("Import Complete");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

importData();