const fs = require("fs");
const path = require("path");

const DATASET_FOLDER = "./dataset/selected-routes";

const routes = [];

const files = fs.readdirSync(DATASET_FOLDER);

files.forEach((file, index) => {
  // Skip non-PLT files
  if (!file.endsWith(".plt")) return;

  const filePath = path.join(DATASET_FOLDER, file);

  const content = fs.readFileSync(filePath, "utf8");

  // Skip first 6 header lines
  const lines = content.split("\n").slice(6);

  const points = [];

  lines.forEach((line) => {
    if (!line.trim()) return;

    const parts = line.split(",");

    if (parts.length < 7) return;

    points.push({
      lat: Number(parts[0]),
      lng: Number(parts[1]),
      altitude: Number(parts[3]),
      timestamp: `${parts[5]}T${parts[6].trim()}`
    });
  });

  routes.push({
    truckId: `TRK${String(index + 1).padStart(3, "0")}`,
    routeFile: file,
    points
  });
});

// Create output folder if it doesn't exist
if (!fs.existsSync("./output")) {
  fs.mkdirSync("./output");
}

// Save routes as JSON
fs.writeFileSync(
  "./output/routes.json",
  JSON.stringify(routes, null, 2)
);

console.log(`Created ${routes.length} routes`);