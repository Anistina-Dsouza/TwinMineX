require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();

app.use(cors());

const client = new MongoClient(
  process.env.MONGO_URI
);

let db;

async function connectDB() {
  await client.connect();

  db = client.db("mineDigitalTwin");

  console.log("MongoDB Connected");
}

app.get("/routes", async (req, res) => {
  const routes = await db
    .collection("routes")
    .find({})
    .toArray();

  res.json(routes);
});

app.get("/trucks", async (req, res) => {
  const trucks = await db
    .collection("trucks")
    .find({})
    .toArray();

  res.json(trucks);
});

app.get("/towers", async (req, res) => {
  const towers = await db
    .collection("towers")
    .find({})
    .toArray();

  res.json(towers);
});

connectDB().then(() => {
  app.listen(5000, () => {
    console.log(
      "Server running on port 5000"
    );
  });
});