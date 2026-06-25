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
import { VRButton } from "three/addons/webxr/VRButton.js";
import {
  NODES, EDGES, LOAD_ZONES, DUMP_ZONES, FUEL_ZONES,
  HUB_NODES, WORLD_BOUNDS, getTruckRoutes, findPath, getZ
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

  /* pit road — visually distinct from surface roads */
  pitRoad:      0x5c3a1e,   // warm brown-ochre — matches raw earth
  pitRoadStripe:0xd4a44c,   // amber stripe — high contrast in the pit

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
export function createScene(container, apiTowers, apiRoutes, onTruckSelect) {

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
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  const vrButton = VRButton.createButton(renderer);
  vrButton.style.position = "absolute";
  vrButton.style.bottom = "14px";
  vrButton.style.left = "50%";
  vrButton.style.transform = "translateX(-50%)";
  vrButton.style.zIndex = "100";
  container.appendChild(vrButton);

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

  // const ground = new THREE.Mesh(
  //   new THREE.PlaneGeometry(GW, GH),
  //   stdMat({ color: C.ground, emissive: C.ground, emissiveIntensity: 0.04, roughness: 0.95 })
  // );
  // ground.rotation.x = -Math.PI / 2;
  // ground.position.y = -2;
  // ground.receiveShadow = true;
  // scene.add(ground);

  // const grid = new THREE.GridHelper(Math.max(GW, GH), 100, C.gridMajor, C.gridMinor);
  // grid.position.y = -1.5;
  // scene.add(grid);

  /* ════════════════════════════════════════════════
     ROAD NETWORK — realistic mine haul roads
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

  // All node names that sit inside mine pits (spiral haul roads)
  const PIT_ROAD_NODES = new Set([
    "fw_pit_1_a","fw_pit_1_b","fw_pit_1_c","fw_pit_1_d","fw_pit_1_e","fw_pit_1_f","fw_pit_1_g",
    "fw_pit_2_a","fw_pit_2_b","fw_pit_2_c","fw_pit_2_d","fw_pit_2_e","fw_pit_2_f","fw_pit_2_g",
    "fw_pit_3_a","fw_pit_3_b","fw_pit_3_c","fw_pit_3_d","fw_pit_3_e","fw_pit_3_f","fw_pit_3_g",
    "n_q_1_a","n_q_1_b","n_q_1_c","n_q_1_d","n_q_1_e","n_q_1_f",
    "n_q_2_a","n_q_2_b","n_q_2_c","n_q_2_d","n_q_2_e","n_q_2_f",
    "ne_q_1_a","ne_q_1_b","ne_q_1_c","ne_q_1_d","ne_q_1_e","ne_q_1_f",
    "ne_q_2_a","ne_q_2_b","ne_q_2_c","ne_q_2_d","ne_q_2_e","ne_q_2_f",
    "s_sp_1_a","s_sp_1_b","s_sp_1_c","s_sp_1_d","s_sp_1_e","s_sp_1_f",
    "s_sp_2_a","s_sp_2_b","s_sp_2_c","s_sp_2_d","s_sp_2_e","s_sp_2_f","s_sp_2_g","s_sp_2_h",
    "fw_load_spur_1","fw_load_spur_2","fw_load_spur_3","fw_load_spur_4",
    "fw_load_spur_5","fw_load_spur_6","fw_load_spur_7","fw_load_spur_8",
    "fw_load_spur_9","fw_load_spur_10","fw_load_spur_11","fw_load_spur_12",
    "n_load_spur_1","n_load_spur_2","n_load_spur_3","n_load_spur_4","n_load_spur_5","n_load_spur_6",
    "ne_load_spur_1","ne_load_spur_2","ne_load_spur_3","ne_load_spur_4","ne_load_spur_5","ne_load_spur_6",
  ]);

  /* ── Road materials ── */
  // Asphalt surface — dark charcoal grey, slight sheen
  const matAsphalt     = stdMat({ color: 0x2c2c2c, emissive: 0x1a1a1a, emissiveIntensity: 0.06, roughness: 0.88, metalness: 0.02 });
  // Haul road asphalt — slightly lighter, more worn
  const matAsphaltHaul = stdMat({ color: 0x383838, emissive: 0x222222, emissiveIntensity: 0.08, roughness: 0.82, metalness: 0.03 });
  // Pit road — compacted brown-red earth/gravel
  const matAsphaltPit  = stdMat({ color: 0x5a3a20, emissive: 0x3a2210, emissiveIntensity: 0.12, roughness: 0.95, metalness: 0.0 });
  // Gravel shoulder bed — lighter, rougher
  const matGravel      = stdMat({ color: 0x6b6152, emissive: 0x4a4238, emissiveIntensity: 0.04, roughness: 1.0, metalness: 0.0 });
  const matGravelPit   = stdMat({ color: 0x7a5a3a, emissive: 0x5a4228, emissiveIntensity: 0.06, roughness: 1.0, metalness: 0.0 });
  // Edge lines — solid white
  const matEdgeLine    = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
  // Centre line — dashed yellow for haul, solid white for normal
  const matCentreYellow = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
  const matCentreWhite  = new THREE.MeshBasicMaterial({ color: 0xdddddd });
  // Pit road amber centre
  const matCentrePit    = new THREE.MeshBasicMaterial({ color: 0xd4a44c });
  // Barrier/guardrail materials
  const matGuardrail    = stdMat({ color: 0xcccccc, emissive: 0x888888, emissiveIntensity: 0.1, roughness: 0.4, metalness: 0.6 });
  const matBollardRed   = new THREE.MeshBasicMaterial({ color: 0xdd2200 });
  const matBollardWhite = new THREE.MeshBasicMaterial({ color: 0xffffff });

  /* ── Quaternion-aligned mesh builder ── */
  function alignedMesh(sx, sy, sz, ex, ey, ez, geoLen, geoH, geoW, material) {
    const dx = ex - sx, dy = ey - sy, dz = ez - sz;
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(geoLen, geoH, geoW), material);
    const dir = new THREE.Vector3(dx, dy, dz).normalize();
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir);
    mesh.position.set((sx+ex)/2, (sy+ey)/2, (sz+ez)/2);
    mesh.receiveShadow = true;
    return mesh;
  }

  /* ── Per-edge road rendering (terrain-conforming segmented roads) ── */
  for (const [a, b] of EDGES) {
    const na = NODES[a], nb = NODES[b];
    if (!na || !nb) continue;

    const sx = na.x, sy = na.y + 0.3, sz = na.z;
    const ex = nb.x, ey = nb.y + 0.3, ez = nb.z;
    const dx = ex - sx, dy = ey - sy, dz = ez - sz;
    const len3D = Math.sqrt(dx*dx + dy*dy + dz*dz);
    if (len3D < 0.5) continue;

    const isHaul  = mainHaulSet.has(a) || mainHaulSet.has(b);
    const isPitRd = PIT_ROAD_NODES.has(a) && PIT_ROAD_NODES.has(b);

    // Road dimensions — wide enough for haul trucks
    const paveW    = isHaul ? 20 : (isPitRd ? 14 : 12);     // pavement width
    const paveH    = 0.4;                                     // thin flat surface
    const shouldW  = paveW + 8;                               // gravel shoulder width
    const shouldH  = 0.25;                                    // shoulder slightly below pavement

    const dir3 = new THREE.Vector3(dx, dy, dz).normalize();
    const perpXZ = new THREE.Vector3(-dz, 0, dx).normalize(); // perpendicular on XZ plane

    // Divide the road into 15-unit segments to wrap smoothly over terrain hills and valleys
    const SEG_LENGTH = 15;
    const numSegments = Math.max(1, Math.ceil(len3D / SEG_LENGTH));

    for (let s = 0; s < numSegments; s++) {
      const t0 = s / numSegments;
      const t1 = (s + 1) / numSegments;

      const x0 = sx + dx * t0;
      const z0 = sz + dz * t0;
      const x1 = sx + dx * t1;
      const z1 = sz + dz * t1;

      // If the edge involves a pit node, interpolate Y linearly. Otherwise, conform to the terrain using getZ
      const involvesPit = PIT_ROAD_NODES.has(a) || PIT_ROAD_NODES.has(b);
      const y0 = involvesPit ? (sy + (ey - sy) * t0) : (getZ(x0 + 75, z0 + 225) * 0.04 + 0.3);
      const y1 = involvesPit ? (sy + (ey - sy) * t1) : (getZ(x1 + 75, z1 + 225) * 0.04 + 0.3);

      const segDx = x1 - x0;
      const segDy = y1 - y0;
      const segDz = z1 - z0;
      const segLen3D = Math.sqrt(segDx*segDx + segDy*segDy + segDz*segDz);
      if (segLen3D < 0.1) continue;

      const segPerpXZ = new THREE.Vector3(-segDz, 0, segDx).normalize();

      /* ─── Layer 1: Gravel shoulder bed (wider, sits underneath) ─── */
      const shoulderY = -0.12;  // slightly below pavement
      const shoulder = alignedMesh(
        x0, y0 + shoulderY, z0,
        x1, y1 + shoulderY, z1,
        segLen3D, shouldH, shouldW,
        isPitRd ? matGravelPit : matGravel
      );
      scene.add(shoulder);

      /* ─── Layer 2: Asphalt pavement surface ─── */
      let paveMat;
      if (isPitRd) paveMat = matAsphaltPit;
      else if (isHaul) paveMat = matAsphaltHaul;
      else paveMat = matAsphalt;

      const pavement = alignedMesh(x0, y0, z0, x1, y1, z1, segLen3D, paveH, paveW, paveMat);
      pavement.castShadow = true;
      scene.add(pavement);

      /* ─── Layer 3: Edge lines — solid white strips along both sides ─── */
      const lineH = 0.08;
      const lineW = 0.6;
      const edgeOffset = paveW / 2 - 0.5;  // just inside the pavement edge

      for (const side of [-1, 1]) {
        const offX = segPerpXZ.x * edgeOffset * side;
        const offZ = segPerpXZ.z * edgeOffset * side;
        const edge = alignedMesh(
          x0 + offX, y0 + paveH/2 + 0.01, z0 + offZ,
          x1 + offX, y1 + paveH/2 + 0.01, z1 + offZ,
          segLen3D, lineH, lineW,
          isPitRd ? matCentrePit : matEdgeLine
        );
        scene.add(edge);
      }

      /* ─── Layer 4: Centre markings (Solid) ─── */
      if (!isHaul) {
        const centreLine = alignedMesh(
          x0, y0 + paveH/2 + 0.02, z0,
          x1, y1 + paveH/2 + 0.02, z1,
          segLen3D, lineH, isPitRd ? 1.2 : 0.7,
          isPitRd ? matCentrePit : matCentreWhite
        );
        scene.add(centreLine);
      }

      /* ─── Layer 5: Pit road extras — guardrails ─── */
      if (isPitRd) {
        const railH = 2.2, railW = 0.5;
        const railOffset = paveW / 2 + 1.5;
        for (const side of [-1, 1]) {
          const rOffX = segPerpXZ.x * railOffset * side;
          const rOffZ = segPerpXZ.z * railOffset * side;
          const rail = alignedMesh(
            x0 + rOffX, y0 + railH/2 + paveH/2, z0 + rOffZ,
            x1 + rOffX, y1 + railH/2 + paveH/2, z1 + rOffZ,
            segLen3D, railH, railW, matGuardrail
          );
          scene.add(rail);
        }
      }
    }

    /* ─── Layer 4: Centre markings (Dashed yellow for haul roads) ─── */
    if (isHaul) {
      const dashLen = 6, gapLen = 4;
      const totalCycle = dashLen + gapLen;
      const numDashes = Math.floor(len3D / totalCycle);
      for (let d = 0; d < numDashes; d++) {
        const tStart = (d * totalCycle + gapLen/2) / len3D;
        const tEnd   = (d * totalCycle + gapLen/2 + dashLen) / len3D;
        if (tEnd > 1) break;
        const dsx = sx + dx * tStart;
        const dsz = sz + dz * tStart;
        const dex = sx + dx * tEnd;
        const dez = sz + dz * tEnd;
        
        const involvesPit = PIT_ROAD_NODES.has(a) || PIT_ROAD_NODES.has(b);
        const dsy = involvesPit
          ? (sy + (ey - sy) * tStart + paveH/2 + 0.02)
          : (getZ(dsx + 75, dsz + 225) * 0.04 + 0.3 + paveH/2 + 0.02);
        const dey = involvesPit
          ? (sy + (ey - sy) * tEnd + paveH/2 + 0.02)
          : (getZ(dex + 75, dez + 225) * 0.04 + 0.3 + paveH/2 + 0.02);
        
        const dash = alignedMesh(dsx, dsy, dsz, dex, dey, dez,
          dashLen, 0.08, 1.0, matCentreYellow);
        scene.add(dash);
      }
    }

    /* ─── Layer 5: Pit road extras — bollards + chevrons ─── */
    if (isPitRd) {
      const railOffset = paveW / 2 + 1.5;
      for (const side of [-1, 1]) {
        const rOffX = perpXZ.x * railOffset * side;
        const rOffZ = perpXZ.z * railOffset * side;

        const bollardSpacing = 40;
        const numBollards = Math.max(2, Math.floor(len3D / bollardSpacing));
        for (let bi = 0; bi <= numBollards; bi++) {
          const t = bi / numBollards;
          const bx = sx + dx * t + rOffX;
          const bz = sz + dz * t + rOffZ;
          const by = sy + (ey - sy) * t + paveH/2;

          const postH = 3.5;
          const postR = 0.4;
          const postBottom = new THREE.Mesh(
            new THREE.CylinderGeometry(postR, postR, postH * 0.5, 6),
            matBollardRed
          );
          postBottom.position.set(bx, by + postH * 0.25, bz);
          scene.add(postBottom);

          const postTop = new THREE.Mesh(
            new THREE.CylinderGeometry(postR, postR, postH * 0.5, 6),
            matBollardWhite
          );
          postTop.position.set(bx, by + postH * 0.75, bz);
          scene.add(postTop);
        }
      }

      // Slope direction chevrons pointing downhill
      if (Math.abs(dy) > 0.3) {
        const downhill = ey < sy ? 1 : -1;
        const chevSpacing = 25;
        const numChevs = Math.max(1, Math.floor(len3D / chevSpacing));
        const matChevron = new THREE.MeshBasicMaterial({
          color: 0xffffff, transparent: true, opacity: 0.9, side: THREE.DoubleSide
        });

        for (let ci = 1; ci <= numChevs; ci++) {
          const t = ci / (numChevs + 1);
          const cx = sx + dx * t;
          const cz = sz + dz * t;
          const cy = sy + (ey - sy) * t + paveH/2 + 0.06;

          const chevShape = new THREE.Shape();
          chevShape.moveTo(0, 2.5);
          chevShape.lineTo(-2, -1.5);
          chevShape.lineTo(-1.2, -1.5);
          chevShape.lineTo(0, 1);
          chevShape.lineTo(1.2, -1.5);
          chevShape.lineTo(2, -1.5);
          chevShape.closePath();

          const chevGeo = new THREE.ShapeGeometry(chevShape);
          const chev = new THREE.Mesh(chevGeo, matChevron);
          chev.rotation.x = -Math.PI / 2;

          const flatDir = new THREE.Vector3(dx * downhill, 0, dz * downhill).normalize();
          const angle = Math.atan2(flatDir.x, flatDir.z);
          chev.rotation.z = -angle;
          chev.position.set(cx, cy, cz);
          scene.add(chev);
        }
      }
    }
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
     PIT OUTLINES — deep open-pit mine excavations
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

  for (const nodeNames of Object.values(pitGroups)) {
    const pts = nodeNames.map(n => NODES[n]).filter(Boolean);
    if (pts.length < 3) continue;

    const centerX = pts.reduce((s, p) => s + p.x, 0) / pts.length;
    const centerZ = pts.reduce((s, p) => s + p.z, 0) / pts.length;

    /* ── Pit geometry parameters ── */
    const levels          = 10;     // number of terraced benches
    const benchHeight     = 8;      // vertical drop per bench
    const totalDepth      = levels * benchHeight; // 80 units deep
    const maxContraction  = 0.55;   // how much the bottom shrinks vs. top rim

    /* ── Top rim — glowing outline at ground level ── */
    const rimPts = pts.map(p => new THREE.Vector3(p.x, 0.5, p.z));
    rimPts.push(rimPts[0].clone()); // close the loop
    const rimGeo = new THREE.BufferGeometry().setFromPoints(rimPts);
    const rimLine = new THREE.Line(rimGeo, new THREE.LineBasicMaterial({
      color: 0xcc8833, linewidth: 2
    }));
    scene.add(rimLine);

    /* ── Rim glow ring — subtle amber glow around the pit edge ── */
    const rimShape = new THREE.Shape(
      pts.map(p => new THREE.Vector2(p.x, p.z))
    );
    const innerRimScale = 0.92;
    const rimHole = new THREE.Path(
      pts.map(p => new THREE.Vector2(
        centerX + (p.x - centerX) * innerRimScale,
        centerZ + (p.z - centerZ) * innerRimScale
      ))
    );
    rimShape.holes.push(rimHole);
    const rimFillGeo = new THREE.ShapeGeometry(rimShape);
    const rimFill = new THREE.Mesh(rimFillGeo, new THREE.MeshBasicMaterial({
      color: 0x886622, transparent: true, opacity: 0.3, side: THREE.DoubleSide
    }));
    rimFill.rotation.x = -Math.PI / 2;
    rimFill.position.y = 0.3;
    scene.add(rimFill);

    /* ── Sloped benches — each level has a sloped wall segment forming a continuous slope ── */
    for (let i = 0; i < levels; i++) {
      const t0 = i / levels;
      const t1 = (i + 1) / levels;
      const scaleOuter = 1 - t0 * maxContraction;
      const scaleInner = 1 - t1 * maxContraction;
      const yTop = -(i * benchHeight) - 0.5;
      const yBot = -((i + 1) * benchHeight) - 0.5;

      // Colour gradient: lighter rock at top, darker at bottom, smooth transition
      const rockLightness = 1.0 - (i / levels) * 0.45;
      const wallColor = new THREE.Color(0x6b5a42).multiplyScalar(rockLightness);

      const wallMat = new THREE.MeshStandardMaterial({
        color: wallColor, roughness: 0.95, metalness: 0.02, side: THREE.DoubleSide
      });

      const outerPoly = pts.map(p => ({
        x: centerX + (p.x - centerX) * scaleOuter,
        z: centerZ + (p.z - centerZ) * scaleOuter
      }));
      const innerPoly = pts.map(p => ({
        x: centerX + (p.x - centerX) * scaleInner,
        z: centerZ + (p.z - centerZ) * scaleInner
      }));

      /* -- Sloped wall segments -- */
      for (let j = 0; j < outerPoly.length; j++) {
        const j2 = (j + 1) % outerPoly.length;
        const p1_top = outerPoly[j], p2_top = outerPoly[j2];
        const p1_bot = innerPoly[j], p2_bot = innerPoly[j2];
        const verts = new Float32Array([
          p1_top.x, yTop, p1_top.z,
          p2_top.x, yTop, p2_top.z,
          p2_bot.x, yBot, p2_bot.z,
          p1_bot.x, yBot, p1_bot.z,
        ]);
        const wallGeo = new THREE.BufferGeometry();
        wallGeo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
        wallGeo.setIndex([0, 1, 2, 0, 2, 3]);
        wallGeo.computeVertexNormals();
        const wallMesh = new THREE.Mesh(wallGeo, wallMat);
        wallMesh.receiveShadow = true;
        wallMesh.castShadow = true;
        scene.add(wallMesh);
      }
    }

    /* ── Bottom floor — solid dark fill at the deepest level ── */
    const bottomScale = 1 - maxContraction;
    const bottomPts2D = pts.map(p => new THREE.Vector2(
      centerX + (p.x - centerX) * bottomScale,
      centerZ + (p.z - centerZ) * bottomScale
    ));
    const bottomShape = new THREE.Shape(bottomPts2D);
    const bottomGeo = new THREE.ShapeGeometry(bottomShape);
    const bottomMesh = new THREE.Mesh(bottomGeo, new THREE.MeshStandardMaterial({
      color: 0x1a1208, emissive: 0x0a0804, emissiveIntensity: 0.1,
      roughness: 1.0, metalness: 0.0, side: THREE.DoubleSide
    }));
    bottomMesh.rotation.x = -Math.PI / 2;
    bottomMesh.position.y = -(totalDepth) - 0.5;
    bottomMesh.receiveShadow = true;
    scene.add(bottomMesh);

    /* ── Depth fog effect — dark haze at mid-depth ── */
    const fogPts = pts.map(p => new THREE.Vector2(
      centerX + (p.x - centerX) * 0.75,
      centerZ + (p.z - centerZ) * 0.75
    ));
    const fogShape = new THREE.Shape(fogPts);
    const fogGeo = new THREE.ShapeGeometry(fogShape);
    const fogMesh = new THREE.Mesh(fogGeo, new THREE.MeshBasicMaterial({
      color: 0x0a0806, transparent: true, opacity: 0.35, side: THREE.DoubleSide
    }));
    fogMesh.rotation.x = -Math.PI / 2;
    fogMesh.position.y = -(totalDepth * 0.5);
    scene.add(fogMesh);
  }

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
     TOWERS — mobile signal transmitters
  ════════════════════════════════════════════════ */
  const COV_SCALE = 0.45;
  const towerObjects = [];

  // K-Means clustering of initial truck positions to select 4 starting nodes with highest truck density
  let centroids = [];
  const step = Math.max(1, Math.floor(truckObjects.length / 4));
  for (let k = 0; k < 4; k++) {
    const tk = truckObjects[Math.min(k * step, truckObjects.length - 1)];
    centroids.push({ x: tk.mesh.position.x, z: tk.mesh.position.z });
  }

  for (let iter = 0; iter < 5; iter++) {
    const clusters = [[], [], [], []];
    truckObjects.forEach(tk => {
      let bestK = 0, bestD = Infinity;
      for (let k = 0; k < 4; k++) {
        const d = Math.hypot(tk.mesh.position.x - centroids[k].x, tk.mesh.position.z - centroids[k].z);
        if (d < bestD) { bestD = d; bestK = k; }
      }
      clusters[bestK].push(tk);
    });
    for (let k = 0; k < 4; k++) {
      if (clusters[k].length > 0) {
        const sumX = clusters[k].reduce((sum, tk) => sum + tk.mesh.position.x, 0);
        const sumZ = clusters[k].reduce((sum, tk) => sum + tk.mesh.position.z, 0);
        centroids[k] = { x: sumX / clusters[k].length, z: sumZ / clusters[k].length };
      }
    }
  }

  // Find the closest road node for each centroid to start the tower allocation
  const startNodeNames = [];
  centroids.forEach(c => {
    let bestNodeName = null, bestD = Infinity;
    Object.entries(NODES).forEach(([name, node]) => {
      const d = Math.hypot(node.x - c.x, node.z - c.z);
      if (d < bestD && !startNodeNames.includes(name)) {
        bestD = d;
        bestNodeName = name;
      }
    });
    startNodeNames.push(bestNodeName || Object.keys(NODES)[0]);
  });

  (apiTowers ?? []).forEach((td, i) => {
    const startNodeName = startNodeNames[i % startNodeNames.length];
    const pos = NODES[startNodeName];

    const homePos = { x: pos.x, y: pos.y, z: pos.z };
    const currentPos = { x: pos.x, y: pos.y, z: pos.z };
    const towerId = td._id ?? `TWR${String(i+1).padStart(3,"0")}`;

    /* Mast */
    const mast = new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 4.5, 85, 8),
      stdMat({ color: C.towerMast, emissive: C.towerMast, emissiveIntensity: 0.15, roughness: 0.5, metalness: 0.6 })
    );
    mast.position.set(currentPos.x, currentPos.y + 42.5, currentPos.z);
    mast.castShadow = true;
    scene.add(mast);

    /* Cross arm */
    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(34, 2.5, 2.5),
      stdMat({ color: C.towerArm, emissive: C.towerArm, emissiveIntensity: 0.1, roughness: 0.5, metalness: 0.7 })
    );
    arm.position.set(currentPos.x, currentPos.y + 80, currentPos.z);
    scene.add(arm);

    /* Beacon */
    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(5, 14, 14),
      new THREE.MeshBasicMaterial({ color: C.beacon })
    );
    beacon.position.set(currentPos.x, currentPos.y + 88, currentPos.z);
    beacon.userData.pulse = true;
    beacon.userData.pulseOffset = i * 0.5;
    scene.add(beacon);

    const bLight = new THREE.PointLight(C.beacon, 4, 150);
    bLight.position.copy(beacon.position);
    scene.add(bLight);

    /* Spherical Coverage Signal Area (Both solid and wireframe for a cool sci-fi look!) */
    const covR = (td.coverageRadius ?? 200) * COV_SCALE;

    const sphereGeo = new THREE.SphereGeometry(covR, 32, 16);
    
    // Transparent solid coverage sphere
    const coverageSphere = new THREE.Mesh(
      sphereGeo,
      new THREE.MeshBasicMaterial({
        color: C.coverage,
        transparent: true,
        opacity: 0.03,
        depthWrite: false,
      })
    );
    coverageSphere.position.set(currentPos.x, currentPos.y + 88, currentPos.z);
    scene.add(coverageSphere);

    // Holographic wireframe coverage sphere
    const coverageWire = new THREE.Mesh(
      sphereGeo,
      new THREE.MeshBasicMaterial({
        color: C.coverage,
        transparent: true,
        opacity: 0.08,
        wireframe: true,
        depthWrite: false,
      })
    );
    coverageWire.position.copy(coverageSphere.position);
    scene.add(coverageWire);

    /* Tower label — bright white on dark bg */
    const tLbl = makeLabel(towerId, {
      bgColor: "#0a2a1a", textColor: "#00ffaa",
      fontSize: 15, width: 160, height: 44,
    });
    tLbl.position.set(currentPos.x, currentPos.y + 102, currentPos.z);
    scene.add(tLbl);

    towerObjects.push({
      id: towerId,
      currentNodeName: startNodeName,
      nextNodeName: startNodeName,
      progress: 1.0,
      path: [],
      currentPos,
      homeNodeName: startNodeName,
      mast,
      arm,
      beacon,
      bLight,
      coverageSphere,
      coverageWire,
      tLbl,
      coverageRadius: covR,
      initialDbRadius: td.coverageRadius ?? 200,
      battery: 80 + Math.random() * 20
    });
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
      t.mesh.position.z = na.z + (nb.z-na.z)*t.progress;
      const involvesPit = PIT_ROAD_NODES.has(t.currentPath[ai]) || PIT_ROAD_NODES.has(t.currentPath[bi]);
      t.mesh.position.y = involvesPit
        ? (na.y + (nb.y - na.y) * t.progress + 9)
        : (getZ(t.mesh.position.x + 75, t.mesh.position.z + 225) * 0.04 + 9);
      t.mesh.rotation.y = Math.atan2(nb.x-na.x, nb.z-na.z);
    });

    // 1. Move towers dynamically along road paths towards assigned truck clusters
    towerObjects.forEach(tower => {
      // Deplete battery slowly
      if (tower.battery === undefined) tower.battery = 80 + Math.random() * 20;
      tower.battery -= 0.015;
      if (tower.battery <= 0) {
        tower.battery = 100; // Recharge back to 100% when depleted
      }

      // Update mesh colors based on battery status
      let targetColor;
      if (tower.battery >= 60) {
        targetColor = new THREE.Color(C.coverage); // healthy (green-cyan)
      } else if (tower.battery >= 20) {
        targetColor = new THREE.Color(0xffaa00); // warning (yellow/amber)
      } else {
        // Red / Orange flashing alert
        const flash = (frame % 20 < 10);
        targetColor = flash ? new THREE.Color(0xff3333) : new THREE.Color(0x330000);
      }

      tower.beacon.material.color.copy(targetColor);
      tower.bLight.color.copy(targetColor);
      if (tower.coverageSphere) {
        tower.coverageSphere.material.color.copy(targetColor);
      }
      if (tower.coverageWire) {
        tower.coverageWire.material.color.copy(targetColor);
      }

      // Find all trucks closest to this tower
      const assignedTrucks = truckObjects.filter(truck => {
        let nearestTower = null;
        let minDist = Infinity;
        towerObjects.forEach(t => {
          const d = Math.hypot(truck.mesh.position.x - t.currentPos.x, truck.mesh.position.z - t.currentPos.z);
          if (d < minDist) {
            minDist = d;
            nearestTower = t;
          }
        });
        return nearestTower === tower;
      });

      // Update tower movement progress along the road graph
      if (tower.currentNodeName !== tower.nextNodeName) {
        tower.progress += 0.015; // travel speed along road segments
        if (tower.progress >= 1.0) {
          tower.progress = 1.0;
          tower.currentNodeName = tower.nextNodeName;
          
          // Remove the completed segment from the path
          if (tower.path.length > 1) {
            tower.path.shift();
          }
        }
      }

      // If standing at a node, choose next node along the path towards the optimal target node
      if (tower.currentNodeName === tower.nextNodeName) {
        // Recalculate optimal target node in the network closest to the centroid of assigned trucks
        let targetNodeName = tower.homeNodeName;
        if (assignedTrucks.length > 0) {
          const sumX = assignedTrucks.reduce((sum, tk) => sum + tk.mesh.position.x, 0);
          const sumZ = assignedTrucks.reduce((sum, tk) => sum + tk.mesh.position.z, 0);
          const centroidX = sumX / assignedTrucks.length;
          const centroidZ = sumZ / assignedTrucks.length;

          let bestNodeName = null, bestD = Infinity;
          Object.entries(NODES).forEach(([name, node]) => {
            const d = Math.hypot(node.x - centroidX, node.z - centroidZ);
            if (d < bestD) {
              bestD = d;
              bestNodeName = name;
            }
          });
          if (bestNodeName) targetNodeName = bestNodeName;
        }

        // If target node is different, find a new path along the road network
        if (targetNodeName !== tower.currentNodeName) {
          const newPath = findPath(tower.currentNodeName, targetNodeName);
          if (newPath && newPath.length > 1) {
            tower.path = newPath;
            tower.nextNodeName = newPath[1];
            tower.progress = 0.0;
          }
        }
      }

      // Compute actual position (interpolating between currentNode and nextNode along the road)
      const na = NODES[tower.currentNodeName];
      const nb = NODES[tower.nextNodeName];
      if (na && nb) {
        tower.currentPos.x = na.x + (nb.x - na.x) * tower.progress;
        tower.currentPos.z = na.z + (nb.z - na.z) * tower.progress;
        const involvesPit = PIT_ROAD_NODES.has(tower.currentNodeName) || PIT_ROAD_NODES.has(tower.nextNodeName);
        tower.currentPos.y = involvesPit
          ? (na.y + (nb.y - na.y) * tower.progress)
          : (getZ(tower.currentPos.x + 75, tower.currentPos.z + 225) * 0.04);
      }

      // Update Three.js node positions for tower elements
      tower.mast.position.set(tower.currentPos.x, tower.currentPos.y + 42.5, tower.currentPos.z);
      tower.arm.position.set(tower.currentPos.x, tower.currentPos.y + 80, tower.currentPos.z);
      tower.beacon.position.set(tower.currentPos.x, tower.currentPos.y + 88, tower.currentPos.z);
      tower.bLight.position.copy(tower.beacon.position);
      if (tower.coverageSphere) {
        tower.coverageSphere.position.set(tower.currentPos.x, tower.currentPos.y + 88, tower.currentPos.z);
      }
      if (tower.coverageWire) {
        tower.coverageWire.position.copy(tower.coverageSphere.position);
      }
      if (tower.tLbl) {
        tower.tLbl.position.set(tower.currentPos.x, tower.currentPos.y + 102, tower.currentPos.z);
      }
    });

    // 2. Update truck signal telemetry based on real-time distance to nearest tower
    truckObjects.forEach(t => {
      let maxSignal = 10; // minimum fallback signal
      towerObjects.forEach(tower => {
        const dist = Math.hypot(t.mesh.position.x - tower.currentPos.x, t.mesh.position.z - tower.currentPos.z);
        // Map distance to signal percentage (full signal inside 60% of radius, dropping to 10% beyond radius)
        const rad = tower.coverageRadius;
        let sig = 10;
        if (dist <= rad * 0.6) {
          sig = 100 - Math.floor((dist / (rad * 0.6)) * 15); // 85% to 100%
        } else if (dist <= rad * 1.5) {
          sig = Math.round(85 * (1 - (dist - rad * 0.6) / (rad * 0.9)));
          sig = Math.max(10, sig);
        }
        if (sig > maxSignal) {
          maxSignal = sig;
        }
      });
      t.signal = maxSignal;
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
    getTowerObjects: () => towerObjects,
    selectTruckById: (id) => { resetEmissive(); const f=truckObjects.find(t=>t.id===id); if(f) highlightTruck(f); },
    updateTowerRadius: (id, newRadius) => {
      const tower = towerObjects.find(t => t.id === id);
      if (tower) {
        const scale = newRadius / tower.initialDbRadius;
        tower.coverageSphere.scale.set(scale, scale, scale);
        tower.coverageWire.scale.set(scale, scale, scale);
        tower.coverageRadius = newRadius * COV_SCALE;
      }
    },
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
