const fs = require("fs");

const routes = JSON.parse(
  fs.readFileSync("./output/routes.json", "utf8")
);

// =====================================
// FIND GLOBAL GPS BOUNDS
// =====================================

let minLat = Infinity;
let maxLat = -Infinity;
let minLng = Infinity;
let maxLng = -Infinity;

routes.forEach(route => {
  route.points.forEach(point => {

    if (point.lat < minLat) minLat = point.lat;
    if (point.lat > maxLat) maxLat = point.lat;

    if (point.lng < minLng) minLng = point.lng;
    if (point.lng > maxLng) maxLng = point.lng;

  });
});

console.log("\nGPS Bounds");
console.log({
  minLat,
  maxLat,
  minLng,
  maxLng
});

// =====================================
// NORMALIZE TO MINE SPACE
// =====================================

const MINE_SIZE = 1000;

const normalizedRoutes = routes.map(route => {

  const normalizedPoints = route.points.map(point => {

    const x =
      ((point.lng - minLng) /
      (maxLng - minLng)) *
      MINE_SIZE;

    const z =
      ((point.lat - minLat) /
      (maxLat - minLat)) *
      MINE_SIZE;

    return {
      ...point,
      x: Number(x.toFixed(2)),
      z: Number(z.toFixed(2))
    };
  });

  return {
    ...route,
    points: normalizedPoints
  };
});

// =====================================
// SAVE OUTPUT
// =====================================

fs.writeFileSync(
  "./output/normalizedRoutes.json",
  JSON.stringify(
    normalizedRoutes,
    null,
    2
  )
);

console.log("\nNormalization Complete");
console.log(
  "Saved:",
  "./output/normalizedRoutes.json"
);