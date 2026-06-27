import extractedMap from './extracted_map_data.json';

// ── Centroid offset: X centre=75, Y centre=225 ────────────────────────
const OX = 75;
const OY = 225;

export const NODES = {};
const rawNodes = extractedMap.NODES;

for (const [name, value] of Object.entries(rawNodes)) {
  const [rx, ry, rz] = value;
  const wx = rx - OX;
  const wy = ry - OY;
  NODES[name] = {
    x: wx,
    y: rz * 0.04, // apply standard elevation scaling
    z: wy,
    _rx: rx,
    _ry: ry,
    _rz: rz
  };
}

export const LOAD_ZONES = new Set(extractedMap.LOAD_ZONES);
export const DUMP_ZONES = new Set(extractedMap.DUMP_ZONES);
export const FUEL_ZONES = new Set(extractedMap.FUEL_ZONES);
export const VISUAL_CHAINS = extractedMap.VISUAL_CHAINS;

// Filter edges to ensure both nodes exist
export const EDGES = extractedMap.EDGES.filter(([a, b]) => NODES[a] && NODES[b]);

export const HUB_NODES = new Set([
  "main_hub","n_hub","ne_hub","s_hub","e_hub","fw_hub","sw_hub","service_hub"
]);

// ── Build road graph for truck pathfinding ───────────────────────────
export const ROAD_GRAPH = {};
for (const name of Object.keys(NODES)) ROAD_GRAPH[name] = [];
for (const [a, b] of EDGES) {
  const na = NODES[a], nb = NODES[b];
  const d = Math.hypot(na.x - nb.x, na.z - nb.z);
  ROAD_GRAPH[a].push({ node: b, dist: d });
  ROAD_GRAPH[b].push({ node: a, dist: d });
}

// ── Dijkstra for truck route planning ──────────────────────────────
export function findPath(from, to) {
  const dist = {}, prev = {}, visited = new Set();
  for (const n of Object.keys(NODES)) dist[n] = Infinity;
  dist[from] = 0;
  const queue = [{ node: from, d: 0 }];

  while (queue.length) {
    queue.sort((a, b) => a.d - b.d);
    const { node: cur } = queue.shift();
    if (visited.has(cur)) continue;
    visited.add(cur);
    if (cur === to) break;
    for (const { node: nb, dist: w } of (ROAD_GRAPH[cur] ?? [])) {
      const nd = dist[cur] + w;
      if (nd < dist[nb]) {
        dist[nb] = nd;
        prev[nb] = cur;
        queue.push({ node: nb, d: nd });
      }
    }
  }
  // Reconstruct path
  const path = [];
  let cur = to;
  while (cur) { path.unshift(cur); cur = prev[cur]; }
  return path[0] === from ? path : null;
}

// ── Truck starting assignments ────────────────────────────────────
const LOAD_ZONE_LIST = Array.from(LOAD_ZONES).filter(n => NODES[n]);
const DUMP_ZONE_LIST = Array.from(DUMP_ZONES).filter(n => NODES[n]);

export function getTruckRoutes(count = 20) {
  if (LOAD_ZONE_LIST.length === 0 || DUMP_ZONE_LIST.length === 0) {
    return []; // Safeguard if zones are missing
  }
  return Array.from({ length: count }, (_, i) => {
    const loadZone = LOAD_ZONE_LIST[i % LOAD_ZONE_LIST.length];
    const ln = NODES[loadZone];
    let bestDump = DUMP_ZONE_LIST[0], bestDist = Infinity;
    for (const dz of DUMP_ZONE_LIST) {
      const dn = NODES[dz];
      if (!dn) continue;
      const d = Math.hypot(ln.x - dn.x, ln.z - dn.z);
      if (d < bestDist) { bestDist = d; bestDump = dz; }
    }
    return { id: `TRK${String(i+1).padStart(3,"0")}`, loadZone, dumpZone: bestDump };
  });
}

// ── World bounds (for camera framing) ────────────────────────────
let minX = 9999, maxX = -9999, minZ = 9999, maxZ = -9999;
for (const n of Object.values(NODES)) {
  if (n.x < minX) minX = n.x;
  if (n.x > maxX) maxX = n.x;
  if (n.z < minZ) minZ = n.z;
  if (n.z > maxZ) maxZ = n.z;
}
export const WORLD_BOUNDS = {
  minX: minX - 100, maxX: maxX + 100,
  minZ: minZ - 100, maxZ: maxZ + 100,
  width: maxX - minX + 200, height: maxZ - minZ + 200,
  spanX: maxX - minX, spanZ: maxZ - minZ,
  centerX: (minX + maxX) / 2, centerZ: (minZ + maxZ) / 2
};

// ── Terrain height estimator ─────────────────────────────────────
// Uses nearest neighbor to estimate off-road terrain elevation.
const nodeEntries = Object.values(NODES);
export function getZ(rx, ry) {
    if (nodeEntries.length === 0) return 0;
    let bestZ = 0;
    let bestDist = Infinity;
    const wx = rx - OX;
    const wy = ry - OY;
    
    // Simple nearest neighbor search
    for (const n of nodeEntries) {
        const d = (n.x - wx) ** 2 + (n.z - wy) ** 2;
        if (d < bestDist) {
            bestDist = d;
            bestZ = n._rz;
        }
    }
    return bestZ;
}