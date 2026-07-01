require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const http = require("http");
const WebSocket = require("ws");
const os = require("os");

const app = express();
app.use(cors());

// Get local network IP address (e.g. 192.168.x.x)
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

let db;
const client = new MongoClient(process.env.MONGO_URI);

async function connectDB() {
  await client.connect();
  db = client.db("mineDigitalTwin");
  console.log("MongoDB Connected");
}

app.get("/ip", (req, res) => {
  res.json({ ip: getLocalIP() });
});

app.get("/routes", async (req, res) => {
  const routes = await db.collection("routes").find({}).toArray();
  res.json(routes);
});

app.get("/trucks", async (req, res) => {
  const trucks = await db.collection("trucks").find({}).toArray();
  res.json(trucks);
});

app.get("/towers", async (req, res) => {
  const towers = await db.collection("towers").find({}).toArray();
  res.json(towers);
});

// Setup WebSocket Server for Remote Control on port 5001
const wss = new WebSocket.Server({ port: 5001 }, () => {
  console.log("WebSocket Remote Broker running on port 5001");
});

const clients = {
  hosts: new Set(),
  remotes: new Set()
};

wss.on("connection", (ws) => {
  let role = null;

  ws.on("message", (messageStr) => {
    try {
      const msg = JSON.parse(messageStr);
      
      // Handle registration
      if (msg.type === "register") {
        role = msg.clientType;
        if (role === "host") {
          clients.hosts.add(ws);
          console.log("Host registered. Total hosts:", clients.hosts.size);
        } else if (role === "remote") {
          clients.remotes.add(ws);
          console.log("Remote controller registered. Total remotes:", clients.remotes.size);
          // Notify remote that connection is ready
          ws.send(JSON.stringify({ type: "status", connected: true }));
        }
        return;
      }

      // Relay all remote commands to hosts
      if (role === "remote") {
        const payload = JSON.stringify(msg);
        clients.hosts.forEach((host) => {
          if (host.readyState === WebSocket.OPEN) {
            host.send(payload);
          }
        });
      }
    } catch (err) {
      console.error("Error processing ws message:", err);
    }
  });

  ws.on("close", () => {
    if (role === "host") {
      clients.hosts.delete(ws);
      console.log("Host disconnected. Total hosts:", clients.hosts.size);
    } else if (role === "remote") {
      clients.remotes.delete(ws);
      console.log("Remote disconnected. Total remotes:", clients.remotes.size);
    }
  });
});

connectDB().then(() => {
  app.listen(5000, () => {
    console.log("Express API running on port 5000");
  });
});