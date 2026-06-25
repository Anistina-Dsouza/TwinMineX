require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();

const client = new MongoClient(
  process.env.MONGO_URI
);

let db;

app.use(cors());
app.use(express.json());

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

app.put("/towers/:id", async (req, res) => {
  const { id } = req.params;
  const { coverageRadius } = req.body;
  try {
    const result = await db.collection("towers").updateOne(
      { _id: id },
      { $set: { coverageRadius: Number(coverageRadius) } }
    );
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

connectDB().then(() => {
  app.listen(5000, () => {
    console.log(
      "Server running on port 5000"
    );
  });
});