// import * as THREE from "three";
// import {
//   NODES,
//   EDGES,
//   LOAD_ZONES,
//   DUMP_ZONES,
//   FUEL_ZONES,
//   HUB_NODES
// } from "./mapData";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { createHeatmapOverlay } from "./heatmap";

// export function createScene(container, towers, routes, onTruckSelect, onSceneReady) {

//   const scene = new THREE.Scene();
//   scene.background = new THREE.Color(0x040e1a);
//   scene.fog = new THREE.FogExp2(0x040e1a, 0.00042);

//   const raycaster = new THREE.Raycaster();
//   const mouse = new THREE.Vector2();

//   // =========================
//   // CAMERA
//   // =========================
//   const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 5000);
//   camera.position.set(500, 600, 1100);

//   // =========================
//   // RENDERER
//   // =========================
//   const renderer = new THREE.WebGLRenderer({ antialias: true });
//   renderer.setSize(container.clientWidth, container.clientHeight);
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//   renderer.toneMapping = THREE.ACESFilmicToneMapping;
//   renderer.toneMappingExposure = 1.2;
//   container.appendChild(renderer.domElement);

//   // =========================
//   // CONTROLS
//   // =========================
//   const controls = new OrbitControls(camera, renderer.domElement);
//   controls.enableDamping = true;
//   controls.dampingFactor = 0.06;
//   controls.target.set(500, 0, 500);
//   controls.minDistance = 200;
//   controls.maxDistance = 1800;
//   controls.minPolarAngle = Math.PI / 6;
//   controls.maxPolarAngle = Math.PI / 2.15;
//   controls.update();

//   // =========================
//   // GROUND
//   // =========================
//   const ground = new THREE.Mesh(
//     new THREE.PlaneGeometry(1000, 1000),
//     new THREE.MeshStandardMaterial({ color: 0x1a2a1a, roughness: 0.95, metalness: 0.05 })
//   );
//   ground.rotation.x = -Math.PI / 2;
//   ground.position.set(0, 0, 0);
//   scene.add(ground);

//   const grid = new THREE.GridHelper(1000, 50, 0x004455, 0x002233);
//   grid.position.set(500, 0.5, 500);
//   // scene.add(grid);

//   // =========================
//   // HEATMAP OVERLAY
//   // =========================
//   const heatmap = createHeatmapOverlay(
//   scene,
//   1400,
//   { x: 0, z: 0 }
//   );

//   // =========================
//   // LIGHTS
//   // =========================
//   scene.add(new THREE.AmbientLight(0x112244, 1.5));
//   const sun = new THREE.DirectionalLight(0x8888ff, 1.5);
//   sun.position.set(300, 500, 300);
//   scene.add(sun);
//   const fillLight = new THREE.PointLight(0x004488, 2, 1200);
//   fillLight.position.set(500, 200, 500);
//   scene.add(fillLight);
//   const rimLight = new THREE.PointLight(0x00c8ff, 1.5, 600);
//   rimLight.position.set(100, 150, 100);
//   scene.add(rimLight);

//   createRoadNetwork(scene); //calling roadnetwork
//   createNodes(scene);

//   // =========================
//   // ROADS
//   // =========================
//   function createRoad(sx, sz, ex, ez) {
//     const dx = ex - sx, dz = ez - sz;
//     const len = Math.sqrt(dx*dx + dz*dz);
//     const road = new THREE.Mesh(
//       new THREE.BoxGeometry(len, 0.5, 18),
//       new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.9 })
//     );
//     road.position.set((sx+ex)/2, 0.3, (sz+ez)/2);
//     road.rotation.y = Math.atan2(dz, dx);
//     scene.add(road);
//     const line = new THREE.Mesh(
//       new THREE.BoxGeometry(len, 0.6, 2),
//       new THREE.MeshBasicMaterial({ color: 0x334455 })
//     );
//     line.position.copy(road.position); line.position.y = 0.6;
//     line.rotation.y = road.rotation.y;
//     scene.add(line);
//   }
// /**fake roads commented out */
//   // createRoad(pitA.x, pitA.z, dumpSite.x, dumpSite.z);
//   // createRoad(pitB.x, pitB.z, dumpSite.x, dumpSite.z);
//   // createRoad(controlCenter.x, controlCenter.z, dumpSite.x, dumpSite.z);

//   // =========================
//   // TOWERS
//   // =========================
//   towers.forEach((td) => {
//     const mast = new THREE.Mesh(
//       new THREE.CylinderGeometry(3, 5, 110, 8),
//       new THREE.MeshStandardMaterial({ color: 0x223344, roughness: 0.6, metalness: 0.4 })
//     );
//     mast.position.set(td.x, 55, td.z);
//     scene.add(mast);

//     const beacon = new THREE.Mesh(
//       new THREE.SphereGeometry(6, 16, 16),
//       new THREE.MeshBasicMaterial({ color: 0x00ff9d })
//     );
//     beacon.position.set(td.x, 114, td.z);
//     beacon.userData.pulse = true;
//     scene.add(beacon);

//     const beaconLight = new THREE.PointLight(0x00ff9d, 2, 200);
//     beaconLight.position.set(td.x, 114, td.z);
//     scene.add(beaconLight);

//     const coverage = new THREE.Mesh(
//       new THREE.CircleGeometry(td.coverageRadius, 72),
//       new THREE.MeshBasicMaterial({ color: 0x00ff9d, transparent: true, opacity: 0.05, side: THREE.DoubleSide })
//     );
//     coverage.rotation.x = -Math.PI / 2;
//     coverage.position.set(td.x, 0.3, td.z);
//     scene.add(coverage);

//     const covRing = new THREE.Mesh(
//       new THREE.RingGeometry(td.coverageRadius - 3, td.coverageRadius + 3, 72),
//       new THREE.MeshBasicMaterial({ color: 0x00ff9d, transparent: true, opacity: 0.3, side: THREE.DoubleSide })
//     );
//     covRing.rotation.x = -Math.PI / 2;
//     covRing.position.set(td.x, 0.4, td.z);
//     scene.add(covRing);
//   });


//   function createRoadNetwork(scene) {

//   EDGES.forEach(([a, b]) => {

//     const start = NODES[a];
//     const end = NODES[b];

//     if (!start || !end) return;

//     const points = [
//       new THREE.Vector3(
//         start.x,
//         1,
//         start.z
//       ),

//       new THREE.Vector3(
//         end.x,
//         1,
//         end.z
//       )
//     ];

//     const geometry =
//       new THREE.BufferGeometry()
//         .setFromPoints(points);

//     const line =
//       new THREE.Line(
//         geometry,
//         new THREE.LineBasicMaterial({
//           color: 0x00ffff
//         })
//       );

//     scene.add(line);

//   });

//   }

//   function createNodes(scene) {

//   Object.values(NODES).forEach((node) => {

//     const dot = new THREE.Mesh(
//       new THREE.SphereGeometry(2.5, 8, 8),
//       new THREE.MeshBasicMaterial({
//         color: 0xffffff
//       })
//     );

//     dot.position.set(
//       node.x,
//       2,
//       node.z
//     );

//     scene.add(dot);

//   });

//   }
//   // =========================
//   // LABEL
//   // =========================
//   function createLabel(text) {
//     const canvas = document.createElement("canvas");
//     canvas.width = 256; canvas.height = 64;
//     const ctx = canvas.getContext("2d");
//     ctx.font = "bold 22px monospace";
//     ctx.fillStyle = "#00c8ff";
//     ctx.shadowColor = "#00c8ff"; ctx.shadowBlur = 8;
//     ctx.fillText(text, 8, 42);
//     const sprite = new THREE.Sprite(
//       new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true })
//     );
//     sprite.scale.set(55, 14, 1);
//     return sprite;
//   }

//   // =========================
//   // TRUCKS
//   // =========================
//   const truckObjects = [];

//   routes.forEach((route, index) => {
//     const truck = new THREE.Group();

//     const body = new THREE.Mesh(
//       new THREE.BoxGeometry(40, 14, 22),
//       new THREE.MeshStandardMaterial({ color: 0xe87010, roughness: 0.5, metalness: 0.3 })
//     );
//     body.position.y = 10; truck.add(body);

//     const cabin = new THREE.Mesh(
//       new THREE.BoxGeometry(14, 11, 20),
//       new THREE.MeshStandardMaterial({ color: 0xcc5500, roughness: 0.4, metalness: 0.4 })
//     );
//     cabin.position.set(-12, 19, 0); truck.add(cabin);

//     [-9, 9].forEach(z => {
//       const hl = new THREE.Mesh(
//         new THREE.BoxGeometry(2, 3, 3),
//         new THREE.MeshBasicMaterial({ color: 0xffffaa })
//       );
//       hl.position.set(-20, 12, z); truck.add(hl);
//     });

//     for (let x of [-14, 14]) {
//       for (let z of [-10, 10]) {
//         const wheel = new THREE.Mesh(
//           new THREE.CylinderGeometry(5, 5, 5, 12),
//           new THREE.MeshStandardMaterial({ color: 0x111122, roughness: 0.9 })
//         );
//         wheel.rotation.z = Math.PI / 2;
//         wheel.position.set(x, 5, z); truck.add(wheel);
//       }
//     }
//     console.log(route);
//     console.log(route.loadZone);
//     console.log(NODES[route.loadZone]);


//     console.log("Route:", route);
//     console.log("LoadZone:", route.loadZone);

//     if (!route.points || route.points.length === 0) {
//       console.error("No points for route", route);
//       return;
//     }

//     const firstPoint = route.points[0];

//     console.log("First Point:", firstPoint);

//     truck.position.set(
//       firstPoint.x,
//       8,
//       firstPoint.y
//     );

//     truck.userData.type = "truck";

//     const label = createLabel(`TRK${String(index + 1).padStart(3, "0")}`);
//     label.position.set(0, 38, 0);
//     truck.add(label);
//     scene.add(truck);

//     truckObjects.push({
//       mesh: truck,
//       id: route.truckId || `TRK${index + 1}`,
//       routePoints: route.points,
//       pointIndex: 0,

//       speed: Math.floor(25 + Math.random() * 20),
//       signal: Math.floor(60 + Math.random() * 40),
//       fuel: Math.floor(60 + Math.random() * 40),
//       battery: Math.floor(70 + Math.random() * 30),
//       latency: Math.floor(10 + Math.random() * 20),
//     });
//   });

//   // Expose heatmap update to animation loop
//   heatmap.update(truckObjects);

//   // Tell React the scene + heatmap toggle are ready
//   onSceneReady?.({ heatmap });

//   // =========================
//   // CLICK
//   // =========================
//   function onContainerClick(event) {
//     const rect = container.getBoundingClientRect();
//     mouse.x =  ((event.clientX - rect.left) / rect.width)  * 2 - 1;
//     mouse.y = -((event.clientY - rect.top)  / rect.height) * 2 + 1;
//     raycaster.setFromCamera(mouse, camera);

//     const hits = raycaster.intersectObjects(truckObjects.map(t => t.mesh), true);
//     if (hits.length > 0) {
//       const hit = hits[0].object;
//       const found = truckObjects.find(t => t.mesh === hit || t.mesh.children.includes(hit));
//       if (found) {
//         truckObjects.forEach(t => t.mesh.traverse(c => {
//           if (c.isMesh && c.material.emissive) { c.material.emissive.set(0x000000); c.material.emissiveIntensity = 0; }
//         }));
//         found.mesh.traverse(c => {
//           if (c.isMesh && c.material.emissive) { c.material.emissive.set(0x00c8ff); c.material.emissiveIntensity = 0.6; }
//         });
//         onTruckSelect?.(found);
//         return;
//       }
//     }
//     truckObjects.forEach(t => t.mesh.traverse(c => {
//       if (c.isMesh && c.material.emissive) { c.material.emissive.set(0x000000); c.material.emissiveIntensity = 0; }
//     }));
//     onTruckSelect?.(null);
//   }

//   // =========================
//   // ANIMATION
//   // =========================
//   let frame = 0;
//   function animate() {
//     requestAnimationFrame(animate);
//     frame++;

//     truckObjects.forEach(truck => {

//       const pts = truck.routePoints;

//       if (!pts || pts.length === 0) return;

//       truck.pointIndex =
//         (truck.pointIndex + 1) % pts.length;

//       const p = pts[truck.pointIndex];

//       truck.mesh.position.set(
//         p.x,
//         8,
//         p.y
//       );

//     });

//     // Update heatmap every 60 frames
//     if (frame % 60 === 0) heatmap.update(truckObjects);

//     // Pulse beacon
//     scene.traverse(obj => {
//       if (obj.userData?.pulse) obj.material.opacity = 0.6 + 0.4 * Math.sin(frame * 0.05);
//     });

//     controls.update();
//     renderer.render(scene, camera);
//   }

//   const handleResize = () => {
//     if (!container) return;
//     camera.aspect = container.clientWidth / container.clientHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(container.clientWidth, container.clientHeight);
//   };

//   window.addEventListener("resize", handleResize);
//   container.addEventListener("click", onContainerClick);
//   animate();

//   return {
//     toggleHeatmap: () => heatmap.toggle(),
//     cleanup: () => {
//       window.removeEventListener("resize", handleResize);
//       container.removeEventListener("click", onContainerClick);
//       heatmap.dispose();
//       renderer.dispose();
//       if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
//     },
//   };
// }

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  NODES, EDGES, LOAD_ZONES, DUMP_ZONES, FUEL_ZONES,
  HUB_NODES, WORLD_BOUNDS, getTruckRoutes, findPath
} from "./mapData";
import { createHeatmapOverlay } from "./heatmap";

/* ═══════════════════════════════════════════════════════════
   COLOUR SYSTEM — designed for visibility, not aesthetics
   Rule: every zone type has a unique hue family
   Rule: emissive always set so objects glow even in shadow
   Rule: roads are always lighter than ground
═══════════════════════════════════════════════════════════ */
const C = {
  /* scene base */
  bg:           0x0a0f18,   // deep navy — not pure black
  ground:       0x16201a,   // dark olive-green — distinct from roads
  gridMajor:    0x1a3028,
  gridMinor:    0x0f1e16,

  /* roads — clearly lighter than ground */
  roadSurface:  0x2e3e52,   // blue-grey
  roadHaul:     0x3a5068,   // brighter blue-grey for main haul
  roadStripe:   0x5a8aaa,   // visible centre line
  roadEdge:     0x4a6a7a,

  /* zones — each a distinct saturated hue */
  loadZone:     0xffaa00,   // BRIGHT AMBER  — loading bays
  dumpZone:     0xff6633,   // ORANGE-RED    — dump sites
  fuelZone:     0x00ddff,   // BRIGHT CYAN   — fuel stations
  parkZone:     0xcc66ff,   // PURPLE        — parking
  hub:          0x4488ff,   // BRIGHT BLUE   — hubs
  start:        0x00ff88,   // BRIGHT GREEN  — start zone

  /* pit floors */
  pitFill:      0x0c1510,
  pitOutline:   0x886622,

  /* trucks */
  truckBody:    0xff8800,   // vivid orange — easy to spot
  truckCab:     0xffaa33,   // lighter orange cab
  truckWheel:   0x222233,
  truckHL:      0xffffaa,   // headlights

  /* towers */
  towerMast:    0x607080,
  towerArm:     0x708090,
  beacon:       0x00ffaa,
  coverage:     0x00ffaa,
};

/* ═══════════════════════════════════════════════════════════
   MATERIAL FACTORY
═══════════════════════════════════════════════════════════ */
function stdMat({ color, emissive, emissiveIntensity = 0, roughness = 0.7, metalness = 0.1 } = {}) {
  return new THREE.MeshStandardMaterial({ color, emissive: emissive ?? color, emissiveIntensity, roughness, metalness });
}

/* ═══════════════════════════════════════════════════════════
   CANVAS LABEL HELPER
   Returns a THREE.Sprite with text, coloured background pill
═══════════════════════════════════════════════════════════ */
function makeLabel(text, { bgColor = "#1a2a3a", textColor = "#ffffff", fontSize = 16, width = 220, height = 52 } = {}) {
  const cv  = document.createElement("canvas");
  cv.width  = width; cv.height = height;
  const ctx = cv.getContext("2d");

  /* pill background */
  ctx.fillStyle = bgColor;
  ctx.globalAlpha = 0.85;
  roundRect(ctx, 2, 4, width - 4, height - 8, 8);
  ctx.fill();
  ctx.globalAlpha = 1;

  /* border */
  ctx.strokeStyle = textColor;
  ctx.lineWidth   = 1.5;
  ctx.globalAlpha = 0.6;
  roundRect(ctx, 2, 4, width - 4, height - 8, 8);
  ctx.stroke();
  ctx.globalAlpha = 1;

  /* text */
  ctx.font      = `bold ${fontSize}px 'Courier New', monospace`;
  ctx.fillStyle = textColor;
  ctx.shadowColor = textColor; ctx.shadowBlur = 6;
  ctx.textAlign   = "center";
  ctx.textBaseline= "middle";
  ctx.fillText(text, width / 2, height / 2);

  const sp = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true })
  );
  sp.scale.set(width * 0.28, height * 0.28, 1);
  return sp;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/* ═══════════════════════════════════════════════════════════
   LEGEND OVERLAY  (injected into container as HTML)
═══════════════════════════════════════════════════════════ */
function injectLegend(container) {
  const div = document.createElement("div");
  div.id = "mine-legend";
  div.style.cssText = `
    position:absolute; bottom:14px; left:14px; z-index:30;
    background:rgba(6,14,24,0.88); backdrop-filter:blur(12px);
    border:1px solid rgba(255,255,255,0.1); border-radius:8px;
    padding:10px 14px; font-family:'Courier New',monospace;
    pointer-events:none;
  `;

  const items = [
    { color:"#ffaa00", label:"Load Zone" },
    { color:"#ff6633", label:"Dump Zone" },
    { color:"#00ddff", label:"Fuel Station" },
    { color:"#4488ff", label:"Hub / Junction" },
    { color:"#00ff88", label:"Start Zone" },
    { color:"#cc66ff", label:"Parking" },
    { color:"#ff8800", label:"Haul Truck" },
    { color:"#00ffaa", label:"Signal Tower" },
  ];

  div.innerHTML = `
    <div style="font-size:9px;letter-spacing:.14em;color:rgba(0,200,255,.6);margin-bottom:8px">MAP LEGEND</div>
    ${items.map(({ color, label }) => `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
        <div style="width:12px;height:12px;border-radius:2px;background:${color};box-shadow:0 0 6px ${color}60;flex-shrink:0"></div>
        <span style="font-size:10px;color:rgba(255,255,255,.75);letter-spacing:.06em">${label}</span>
      </div>`).join("")}
  `;
  container.appendChild(div);
  return div;
}
function scalePolygon(points, scale) {

  const cx =
    points.reduce((s,p)=>s+p.x,0) / points.length;

  const cz =
    points.reduce((s,p)=>s+p.z,0) / points.length;

  return points.map(p => ({
    x: cx + (p.x - cx) * scale,
    z: cz + (p.z - cz) * scale
  }));
}
/* ═══════════════════════════════════════════════════════════
   MAIN createScene
═══════════════════════════════════════════════════════════ */
export function createScene(container, apiTowers, onTruckSelect) {

  console.log("createScene started");
  console.log("NODES:", Object.keys(NODES).length);
  console.log("EDGES:", EDGES.length);
  console.log("WORLD_BOUNDS:", WORLD_BOUNDS);

  /* ── Scene ── */
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(C.bg);
  scene.fog = new THREE.FogExp2(C.bg, 0.00018);

  /* ── Camera ── */
  const camera = new THREE.PerspectiveCamera(
    54, container.clientWidth / container.clientHeight, 1, 12000
  );
  camera.position.set(0, 400, 600);

  /* ── Renderer ── */
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    logarithmicDepthBuffer: true,
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
  renderer.toneMapping       = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = 1.4;   // brighter overall
  container.appendChild(renderer.domElement);

  /* ── Controls ── */
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping  = true;
  controls.dampingFactor  = 0.07;
  controls.target.set(0, 0, 0);
  controls.minDistance    = 100;
  controls.maxDistance    = 4500;
  controls.minPolarAngle  = Math.PI / 10;
  controls.maxPolarAngle  = Math.PI / 2.05;
  controls.update();

  /* ════════════════════════════════════════════════
     LIGHTS — bright enough to see all colours
  ════════════════════════════════════════════════ */
  scene.add(new THREE.AmbientLight(0xffffff, 1.8));   // strong ambient so darks aren't black

  const sun = new THREE.DirectionalLight(0xfff5e0, 2.5);
  sun.position.set(500, 900, 400);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near   = 10;
  sun.shadow.camera.far    = 5000;
  sun.shadow.camera.left   = sun.shadow.camera.bottom = -900;
  sun.shadow.camera.right  = sun.shadow.camera.top    =  900;
  scene.add(sun);

  // Fill light from opposite side
  const fill = new THREE.DirectionalLight(0x8ab4d4, 1.2);
  fill.position.set(-400, 400, -300);
  scene.add(fill);

  // Warm point light near centre
  const centre = new THREE.PointLight(0xffd090, 2.5, 1800);
  centre.position.set(0, 300, 0);
  scene.add(centre);

  /* ════════════════════════════════════════════════
     GROUND + GRID
  ════════════════════════════════════════════════ */
  const GW = WORLD_BOUNDS.spanX + 600;
  const GH = WORLD_BOUNDS.spanZ + 600;

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(GW, GH),
    stdMat({ color: C.ground, emissive: C.ground, emissiveIntensity: 0.04, roughness: 0.95 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -2;
  ground.receiveShadow = true;
  scene.add(ground);

  const grid = new THREE.GridHelper(Math.max(GW, GH), 100, C.gridMajor, C.gridMinor);
  grid.position.y = -1.5;
  scene.add(grid);

  /* ════════════════════════════════════════════════
     ROAD NETWORK
  ════════════════════════════════════════════════ */
  const mainHaulSet = new Set([
    "n_haul_1","n_haul_2","n_haul_3",
    "ne_haul_1","ne_haul_2",
    "e_haul_1","e_haul_2","e_haul_3",
    "s_haul_1","s_haul_2","s_haul_3",
    "fw_haul_1","fw_haul_2","fw_haul_3",
    "service_haul_1","service_haul_2",
    "sw_haul_1","sw_haul_2","sw_haul_3",
  ]);

  const matRoadSurface = stdMat({ color: C.roadSurface, emissive: C.roadSurface, emissiveIntensity: 0.08, roughness: 0.9 });
  const matRoadHaul    = stdMat({ color: C.roadHaul,    emissive: C.roadHaul,    emissiveIntensity: 0.12, roughness: 0.85 });
  const matStripe      = new THREE.MeshBasicMaterial({ color: C.roadStripe });

  for (const [a, b] of EDGES) {
    const na = NODES[a], nb = NODES[b];
    if (!na || !nb) continue;
    const sx = na.x, sy = na.y + 0.4, sz = na.z;
    const ex = nb.x, ey = nb.y + 0.4, ez = nb.z;
    const dx = ex - sx, dy = ey - sy, dz = ez - sz;
    const len = Math.sqrt(dx*dx + dy*dy + dz*dz);
    if (len < 0.5) continue;

    const isHaul = mainHaulSet.has(a) || mainHaulSet.has(b);
    const roadW  = isHaul ? 18 : 11;
    const roadH  = isHaul ? 2.5 : 1.8;

    const road = new THREE.Mesh(
      new THREE.BoxGeometry(len, roadH, roadW),
      isHaul ? matRoadHaul : matRoadSurface
    );
    road.position.set((sx+ex)/2, (sy+ey)/2, (sz+ez)/2);
    road.rotation.y = Math.atan2(dx, dz);
    road.receiveShadow = true;
    scene.add(road);

    // Centre stripe — always visible
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(len, 0.5, isHaul ? 2.5 : 1.2),
      matStripe
    );
    stripe.position.copy(road.position);
    stripe.position.y += roadH / 2 + 0.1;
    stripe.rotation.y = road.rotation.y;
    scene.add(stripe);
  }

  /* ════════════════════════════════════════════════
     ZONE MARKERS — high-contrast, clearly visible
  ════════════════════════════════════════════════ */
  const ZONE_CFG = {
    load:  { hex: C.loadZone, css:"#ffaa00", label:"LOAD", r:13, h:5, segs:6  },
    dump:  { hex: C.dumpZone, css:"#ff6633", label:"DUMP", r:14, h:5, segs:8  },
    fuel:  { hex: C.fuelZone, css:"#00ddff", label:"FUEL", r:11, h:7, segs:12 },
    park:  { hex: C.parkZone, css:"#cc66ff", label:"PRK",  r:11, h:5, segs:6  },
    hub:   { hex: C.hub,      css:"#4488ff", label:"HUB",  r:20, h:6, segs:8  },
    start: { hex: C.start,    css:"#00ff88", label:"START",r:17, h:7, segs:8  },
  };

  function getZoneKey(name) {
    if (name === "start_zone")                        return "start";
    if (HUB_NODES.has(name))                         return "hub";
    if (FUEL_ZONES.has(name))                        return "fuel";
    if (DUMP_ZONES.has(name) && name.startsWith("parking")) return "park";
    if (DUMP_ZONES.has(name))                        return "dump";
    if (LOAD_ZONES.has(name))                        return "load";
    return null;
  }

  for (const [name, pos] of Object.entries(NODES)) {
    const key = getZoneKey(name);
    if (!key) continue;
    const { hex, css, label, r, h, segs } = ZONE_CFG[key];

    /* Disc */
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(r, r * 1.12, h, segs),
      stdMat({ color: hex, emissive: hex, emissiveIntensity: 0.55, roughness: 0.5, metalness: 0.2 })
    );
    disc.position.set(pos.x, pos.y + h / 2, pos.z);
    disc.castShadow = true;
    scene.add(disc);

    /* Glow ring on ground */
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(r + 1, r + 7, segs * 6),
      new THREE.MeshBasicMaterial({ color: hex, transparent: true, opacity: 0.4, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(pos.x, pos.y + 0.3, pos.z);
    scene.add(ring);

    /* Label sprite — only for key zone types (not every tiny spur) */
    if (["hub","fuel","start","load","dump"].includes(key)) {
      const shortName = name
        .replace("_zone_","")
        .replace("_hub","")
        .replace("_haul","")
        .replace("load_zone","LZ")
        .replace("dump_zone","DZ")
        .toUpperCase()
        .slice(0, 8);

      const lbl = makeLabel(shortName, {
        bgColor: `rgba(${hexToRgb(hex)},0.8)`,
        textColor: "#ffffff",
        fontSize: 14,
        width: 160, height: 44,
      });
      lbl.position.set(pos.x, pos.y + h + 22, pos.z);
      scene.add(lbl);
    }

    /* Vertical beacon column for hubs + special zones */
    if (["hub","fuel","start"].includes(key)) {
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 50, 6),
        new THREE.MeshBasicMaterial({ color: hex, transparent: true, opacity: 0.35 })
      );
      col.position.set(pos.x, pos.y + 27, pos.z);
      scene.add(col);

      // Point light so it illuminates nearby roads
      const pl = new THREE.PointLight(hex, 1.5, 180);
      pl.position.set(pos.x, pos.y + 20, pos.z);
      scene.add(pl);
    }
  }

  /* ════════════════════════════════════════════════
     PIT OUTLINES
  ════════════════════════════════════════════════ */
  const pitGroups = {
    fw1:["fw_pit_1_a","fw_pit_1_b","fw_pit_1_c","fw_pit_1_d","fw_pit_1_e","fw_pit_1_f","fw_pit_1_g"],
    fw2:["fw_pit_2_a","fw_pit_2_b","fw_pit_2_c","fw_pit_2_d","fw_pit_2_e","fw_pit_2_f","fw_pit_2_g"],
    fw3:["fw_pit_3_a","fw_pit_3_b","fw_pit_3_c","fw_pit_3_d","fw_pit_3_e","fw_pit_3_f","fw_pit_3_g"],
    nq1:["n_q_1_a","n_q_1_b","n_q_1_c","n_q_1_d","n_q_1_e","n_q_1_f"],
    nq2:["n_q_2_a","n_q_2_b","n_q_2_c","n_q_2_d","n_q_2_e","n_q_2_f"],
    ne1:["ne_q_1_a","ne_q_1_b","ne_q_1_c","ne_q_1_d","ne_q_1_e","ne_q_1_f"],
    ne2:["ne_q_2_a","ne_q_2_b","ne_q_2_c","ne_q_2_d","ne_q_2_e","ne_q_2_f"],
    ss1:["s_sp_1_a","s_sp_1_b","s_sp_1_c","s_sp_1_d","s_sp_1_e","s_sp_1_f"],
    ss2:["s_sp_2_a","s_sp_2_b","s_sp_2_c","s_sp_2_d","s_sp_2_e","s_sp_2_f","s_sp_2_g","s_sp_2_h"],
  };

  const matPitFill    = new THREE.MeshStandardMaterial({ color: C.pitFill, emissive: 0x0a1a08, emissiveIntensity: 0.15, roughness: 1, side: THREE.DoubleSide });
  const matPitOutline = new THREE.LineBasicMaterial({ color: C.pitOutline, linewidth: 2 });

  for (const nodeNames of Object.values(pitGroups)) {

    
    const pts =
      nodeNames
        .map(n => NODES[n])
        .filter(Boolean);
        console.log("Pit:", pts.map(p => ({
          x: p.x,
          y: p.y,
          z: p.z
        })));
    if (pts.length < 3) continue;
    
    for (let level = 0; level < 6; level++) {
  
      const scale =
        1 - level * 0.12;
  
      const depth =
        level * 25;
  
      const poly =
        scalePolygon(pts, scale);
  
      const shape =
        new THREE.Shape(
          poly.map(
            p => new THREE.Vector2(p.x, p.z)
          )
        );
  
      const geo =
        new THREE.ShapeGeometry(shape);
  
      const mesh =
        new THREE.Mesh(
          geo,
          new THREE.MeshStandardMaterial({
            color:
              level % 2
                ? 0x3b3125
                : 0x4c4030
          })
        );
  
      mesh.rotation.x =
        -Math.PI / 2;
  
      mesh.position.y =
        -depth;
  
      scene.add(mesh);
    }
  }

  /* ════════════════════════════════════════════════
     TOWERS
  ════════════════════════════════════════════════ */
  const COV_SCALE = 0.22;

  (apiTowers ?? []).forEach((td, i) => {
    let pos;
    if (td.nodeId && NODES[td.nodeId]) {
      pos = NODES[td.nodeId];
    } else {
      pos = { x: (td.x ?? 0) - 75, y: 0, z: (td.z ?? 0) - 225 };
    }

    const towerId = td._id ?? `TWR${String(i+1).padStart(3,"0")}`;

    /* Mast */
    const mast = new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 4.5, 85, 8),
      stdMat({ color: C.towerMast, emissive: C.towerMast, emissiveIntensity: 0.15, roughness: 0.5, metalness: 0.6 })
    );
    mast.position.set(pos.x, pos.y + 42.5, pos.z);
    mast.castShadow = true;
    scene.add(mast);

    /* Cross arm */
    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(34, 2.5, 2.5),
      stdMat({ color: C.towerArm, emissive: C.towerArm, emissiveIntensity: 0.1, roughness: 0.5, metalness: 0.7 })
    );
    arm.position.set(pos.x, pos.y + 80, pos.z);
    scene.add(arm);

    /* Beacon */
    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(5, 14, 14),
      new THREE.MeshBasicMaterial({ color: C.beacon })
    );
    beacon.position.set(pos.x, pos.y + 88, pos.z);
    beacon.userData.pulse = true;
    beacon.userData.pulseOffset = i * 0.5;
    scene.add(beacon);

    const bLight = new THREE.PointLight(C.beacon, 4, 150);
    bLight.position.copy(beacon.position);
    scene.add(bLight);

    /* Coverage disc */
    const covR = (td.coverageRadius ?? 200) * COV_SCALE;

    const coverageDisc = new THREE.Mesh(
      new THREE.CircleGeometry(covR, 64),
      new THREE.MeshBasicMaterial({
        color: C.coverage,
        transparent: true,
        opacity: 0.07,
        side: THREE.DoubleSide
      })
    );
    
    coverageDisc.rotation.x = -Math.PI / 2;
    coverageDisc.position.set(
      pos.x,
      pos.y + 0.5,
      pos.z
    );
    
    scene.add(coverageDisc);

    const coverageRing = new THREE.Mesh(
      new THREE.RingGeometry(covR - 2, covR + 3, 64),
      new THREE.MeshBasicMaterial({
        color: C.coverage,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide
      })
    );
    
    coverageRing.rotation.x = -Math.PI / 2;
    coverageRing.position.set(
      pos.x,
      pos.y + 0.6,
      pos.z
    );
    
    scene.add(coverageRing);






    // const covR = (td.coverageRadius ?? 200) * COV_SCALE;

    // coverageDisc.rotation.x = -Math.PI / 2;
    // coverageDisc.position.set(
    //   pos.x,
    //   pos.y + 0.5,
    //   pos.z
    // );
   
    // coverageRing.rotation.x = -Math.PI / 2;
    // coverageRing.position.set(
    //   pos.x,
    //   pos.y + 0.6,
    //   pos.z
    // );
    // scene.add(coverageDisc);
    // const coverageRing = new THREE.Mesh(
    //   new THREE.RingGeometry(covR - 2, covR + 3, 64),
    //   new THREE.MeshBasicMaterial({
    //     color: C.coverage,
    //     transparent: true,
    //     opacity: 0.45,
    //     side: THREE.DoubleSide
    //   })
    // );

    // scene.add(coverageRing);

    /* Tower label — bright white on dark bg */
    const tLbl = makeLabel(towerId, {
      bgColor: "#0a2a1a", textColor: "#00ffaa",
      fontSize: 15, width: 160, height: 44,
    });
    tLbl.position.set(pos.x, pos.y + 102, pos.z);
    scene.add(tLbl);
  });

  /* ════════════════════════════════════════════════
     LEGEND
  ════════════════════════════════════════════════ */
  container.style.position = "relative";
  const legendEl = injectLegend(container);

  /* ════════════════════════════════════════════════
     HEATMAP
  ════════════════════════════════════════════════ */
  const heatmap = createHeatmapOverlay(
    scene,
    Math.max(WORLD_BOUNDS.spanX, WORLD_BOUNDS.spanZ) + 400,
    { x: 0, z: 0 }
  );

  /* ════════════════════════════════════════════════
     TRUCKS — vivid orange, easy to spot
  ════════════════════════════════════════════════ */
  const truckRoutes  = getTruckRoutes(20);
  const truckObjects = [];
  const raycaster    = new THREE.Raycaster();
  const mouse        = new THREE.Vector2();

  function makeTruck(id) {
    const g = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(28, 12, 18),
      stdMat({ color: C.truckBody, emissive: C.truckBody, emissiveIntensity: 0.3, roughness: 0.5, metalness: 0.25 })
    );
    body.position.y = 9; body.castShadow = true; g.add(body);

    const cab = new THREE.Mesh(
      new THREE.BoxGeometry(11, 10, 16),
      stdMat({ color: C.truckCab, emissive: C.truckCab, emissiveIntensity: 0.25, roughness: 0.45, metalness: 0.3 })
    );
    cab.position.set(-10, 16, 0); cab.castShadow = true; g.add(cab);

    /* Headlights */
    for (const z of [-6, 6]) {
      const hl = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 2.5, 2.5),
        new THREE.MeshBasicMaterial({ color: C.truckHL })
      );
      hl.position.set(-16, 11, z); g.add(hl);
    }

    /* Wheels */
    const wMat = stdMat({ color: C.truckWheel, roughness: 0.9 });
    for (const [wx, wz] of [[-10,-9],[-10,9],[10,-9],[10,9]]) {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(4,4,5,10), wMat);
      w.rotation.z = Math.PI/2;
      w.position.set(wx, 4, wz);
      w.castShadow = true;
      g.add(w);
    }

    /* Label — white text on orange pill */
    const lbl = makeLabel(id, {
      bgColor: "#cc5500", textColor: "#ffffff",
      fontSize: 14, width: 180, height: 46,
    });
    lbl.position.set(0, 34, 0);
    g.add(lbl);

    g.userData.type = "truck";
    return g;
  }

  truckRoutes.forEach((route, i) => {
    const startNode = NODES[route.loadZone];
    if (!startNode) return;
    const mesh = makeTruck(route.id);
    mesh.position.set(startNode.x, startNode.y + 9, startNode.z);
    scene.add(mesh);

    const path       = findPath(route.loadZone, route.dumpZone) ?? [route.loadZone, route.dumpZone];
    const returnPath = [...path].reverse();

    truckObjects.push({
      mesh, id: route.id,
      speed:   25 + Math.floor(Math.random() * 20),
      signal:  60 + Math.floor(Math.random() * 40),
      fuel:    60 + Math.floor(Math.random() * 40),
      battery: 70 + Math.floor(Math.random() * 30),
      latency: 10 + Math.floor(Math.random() * 20),
      path, returnPath,
      currentPath: path,
      segIdx:    Math.floor(Math.random() * Math.max(1, path.length - 1)),
      progress:  Math.random(),
      returning: Math.random() > 0.5,
    });
  });

  /* ════════════════════════════════════════════════
     CLICK
  ════════════════════════════════════════════════ */
  const resetEmissive = () =>
    truckObjects.forEach(t => t.mesh.traverse(c => {
      if (c.isMesh && c.material?.emissive) {
        c.material.emissive.setHex(c.material.color.getHex());
        c.material.emissiveIntensity = c.material.userData?.baseEI ?? 0.3;
      }
    }));

  const highlightTruck = (truckObj) =>
    truckObj.mesh.traverse(c => {
      if (c.isMesh && c.material?.emissive) {
        c.material.emissive.set(0x00ffff);
        c.material.emissiveIntensity = 1.2;
      }
    });

  function onContainerClick(e) {
    const rect = container.getBoundingClientRect();
    mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(truckObjects.map(t => t.mesh), true);
    if (hits.length) {
      const hit   = hits[0].object;
      const found = truckObjects.find(t => t.mesh===hit || t.mesh.children.includes(hit));
      if (found) { resetEmissive(); highlightTruck(found); onTruckSelect?.(found); return; }
    }
    resetEmissive(); onTruckSelect?.(null);
  }

  /* ════════════════════════════════════════════════
     ANIMATION
  ════════════════════════════════════════════════ */
  const SPEED = 0.004;
  let frame = 0, animId;

  function animate() {
    animId = requestAnimationFrame(animate);
    frame++;

    truckObjects.forEach(t => {
      t.progress += SPEED;
      if (t.progress >= 1) {
        t.progress = 0; t.segIdx++;
        if (t.segIdx >= t.currentPath.length - 1) {
          t.segIdx = 0; t.returning = !t.returning;
          t.currentPath = t.returning ? t.returnPath : t.path;
        }
      }
      const ai = Math.min(t.segIdx,     t.currentPath.length-1);
      const bi = Math.min(t.segIdx+1,   t.currentPath.length-1);
      const na = NODES[t.currentPath[ai]];
      const nb = NODES[t.currentPath[bi]];
      if (!na||!nb) return;
      t.mesh.position.x = na.x + (nb.x-na.x)*t.progress;
      t.mesh.position.y = na.y + (nb.y-na.y)*t.progress + 9;
      t.mesh.position.z = na.z + (nb.z-na.z)*t.progress;
      t.mesh.rotation.y = Math.atan2(nb.x-na.x, nb.z-na.z);
    });

    if (frame % 90 === 0) heatmap.update(truckObjects);

    // Beacon pulse
    scene.traverse(obj => {
      if (obj.userData?.pulse) {
        const t2 = frame * 0.045 + (obj.userData.pulseOffset ?? 0);
        obj.material.opacity = 0.45 + 0.55 * Math.sin(t2);
      }
    });

    controls.update();
    renderer.render(scene, camera);
  }

  const onResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener("resize", onResize);
  container.addEventListener("click", onContainerClick);
  animate();

  /* ════════════════════════════════════════════════
     PUBLIC API
  ════════════════════════════════════════════════ */
  return {
    camera, controls,
    getTruckObjects: () => truckObjects,
    selectTruckById: (id) => { resetEmissive(); const f=truckObjects.find(t=>t.id===id); if(f) highlightTruck(f); },
    focusTruck: (id) => {
      const f = truckObjects.find(t=>t.id===id); if(!f) return;
      const p = f.mesh.position;
      controls.target.set(p.x,0,p.z);
      camera.position.set(p.x,320,p.z+380);
      controls.update();
    },
    resetCamera: () => { camera.position.set(0,1000,1400); controls.target.set(0,0,0); controls.update(); },
    toggleHeatmap: () => heatmap.toggle(),
    cleanup: () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("click", onContainerClick);
      heatmap.dispose();
      renderer.dispose();
      if (legendEl.parentNode) legendEl.parentNode.removeChild(legendEl);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    },
  };
}

/* ── Hex int → "r,g,b" string for rgba() ── */
function hexToRgb(hex) {
  return `${(hex>>16)&255},${(hex>>8)&255},${hex&255}`;
}
