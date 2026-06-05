const fs = require("fs");

const routes = JSON.parse(
  fs.readFileSync("./output/normalizedRoutes.json", "utf8")
);

const trucks = routes.map((route) => ({
  _id: route.truckId,

  name: route.truckId,

  fuel:
    Math.floor(Math.random() * 40) + 60,

  load:
    Math.floor(Math.random() * 100),

  speed:
    Math.floor(Math.random() * 25) + 20,

  signal:
    Math.floor(Math.random() * 30) + 70,

  latency:
    Math.floor(Math.random() * 20) + 10,

  battery:
    Math.floor(Math.random() * 20) + 80,

  status: "active"
}));

fs.writeFileSync(
  "./output/trucks.json",
  JSON.stringify(trucks, null, 2)
);

console.log(`Generated ${trucks.length} trucks`);