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
// ── Lightweight 2D Value Noise & Fractional Brownian Motion (FBM) ──
function hash2(x, y) {
  const h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
  return h - Math.floor(h);
}

function noise2(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;

  const ux = fx * fx * (3.0 - 2.0 * fx);
  const uy = fy * fy * (3.0 - 2.0 * fy);

  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);

  return a * (1 - ux) * (1 - uy) +
         b * ux * (1 - uy) +
         c * (1 - ux) * uy +
         d * ux * uy;
}

function fbm(x, y, octaves = 3) {
  let value = 0.0;
  let amplitude = 1.0;
  let frequency = 1.0;
  let totalAmplitude = 0.0;

  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise2(x * frequency, y * frequency);
    totalAmplitude += amplitude;
    amplitude *= 0.5;
    frequency *= 2.0;
  }

  return value / totalAmplitude;
}

function stdMat({ color, emissive, emissiveIntensity = 0, roughness = 0.7, metalness = 0.1, side = THREE.FrontSide } = {}) {
  return new THREE.MeshStandardMaterial({ color, emissive: emissive ?? color, emissiveIntensity, roughness, metalness, side });
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
    { color:"#ff8800", label:"LAND CORE" },
    { color:"#8b5a2b", label:"DEEP PIT" },
    { color:"#00ffff", label:"FUEL STATION" },
    { color:"#2266ff", label:"MAINTENANCE" },
    { color:"#00ff66", label:"SHAFT ZONE" },
    { color:"#aa33ff", label:"REFINERY" },
    { color:"#ff4400", label:"HAUL TRUCK" },
    { color:"#00ccff", label:"SIGNAL TOWERS" },
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
  scene.add(camera);

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

  /* ── VR User Rig & Teleportation ── */
  const xrRig = new THREE.Group();
  scene.add(xrRig);

  const teleportTargets = [];
  const controllers = [];

  const lineGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -1)
  ]);
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x00ffaa,
    transparent: true,
    opacity: 0.8
  });

  const markerGeo = new THREE.RingGeometry(8, 10, 32);
  markerGeo.rotateX(-Math.PI / 2);
  const markerMat = new THREE.MeshBasicMaterial({
    color: 0x00ffaa,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
  });
  const teleportMarker = new THREE.Mesh(markerGeo, markerMat);
  teleportMarker.visible = false;
  scene.add(teleportMarker);

  const tempMatrix = new THREE.Matrix4();
  const vrRaycaster = new THREE.Raycaster();

  for (let i = 0; i < 2; i++) {
    const controller = renderer.xr.getController(i);
    controller.addEventListener("selectstart", () => {
      controller.userData.isSelecting = true;
    });
    controller.addEventListener("selectend", () => {
      controller.userData.isSelecting = false;
      if (teleportMarker.visible) {
        xrRig.position.copy(teleportMarker.position);
        teleportMarker.visible = false;
      }
    });
    xrRig.add(controller);
    controllers.push(controller);

    const pointerLine = new THREE.Line(lineGeo, lineMat);
    pointerLine.name = "pointerLine";
    pointerLine.scale.z = 800;
    controller.add(pointerLine);
  }

  renderer.xr.addEventListener("sessionstart", () => {
    xrRig.position.set(0, 100, 300);
    xrRig.add(camera);
  });
  renderer.xr.addEventListener("sessionend", () => {
    xrRig.position.set(0, 0, 0);
    scene.add(camera);
  });

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

  const roadsGroup = new THREE.Group();
  scene.add(roadsGroup);

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
  const texLoader = new THREE.TextureLoader();
  
  const texDirt = texLoader.load("/unpaved_haul_road_texture.png");
  texDirt.wrapS = THREE.RepeatWrapping;
  texDirt.wrapT = THREE.RepeatWrapping;
  
  const texRock = texLoader.load("/open_pit_rock_texture.png");
  texRock.wrapS = THREE.RepeatWrapping;
  texRock.wrapT = THREE.RepeatWrapping;


  const matAsphaltPool = [];
  const matAsphaltHaulPool = [];
  const matAsphaltPitPool = [];

  for (let r = 1; r <= 8; r++) {
    const tNormal = texDirt.clone(); tNormal.repeat.set(r, 1); tNormal.needsUpdate = true;
    const tHaul   = texDirt.clone(); tHaul.repeat.set(r, 1);   tHaul.needsUpdate = true;
    const tPit    = texDirt.clone(); tPit.repeat.set(r, 1);    tPit.needsUpdate = true;

    matAsphaltPool.push(new THREE.MeshStandardMaterial({
      map: tNormal, bumpMap: tNormal, bumpScale: 0.08,
      color: 0x9c8570, roughness: 0.95, metalness: 0.0,
      emissive: 0x221a12, emissiveIntensity: 0.04,
      side: THREE.DoubleSide
    }));

    matAsphaltHaulPool.push(new THREE.MeshStandardMaterial({
      map: tHaul, bumpMap: tHaul, bumpScale: 0.08,
      color: 0xb59e88, roughness: 0.90, metalness: 0.0,
      emissive: 0x2a2016, emissiveIntensity: 0.05,
      side: THREE.DoubleSide
    }));

    matAsphaltPitPool.push(new THREE.MeshStandardMaterial({
      map: tPit, bumpMap: tPit, bumpScale: 0.12,
      color: 0x7a5a3a, roughness: 0.98, metalness: 0.0,
      emissive: 0x332010, emissiveIntensity: 0.08,
      side: THREE.DoubleSide
    }));
  }

  // Gravel shoulder bed — lighter, rougher
  const matGravel      = stdMat({ color: 0x8a7765, emissive: 0x221a12, emissiveIntensity: 0.04, roughness: 1.0, metalness: 0.0, side: THREE.DoubleSide });
  const matGravelPit   = stdMat({ color: 0x6a4a2f, emissive: 0x2d1a0a, emissiveIntensity: 0.06, roughness: 1.0, metalness: 0.0, side: THREE.DoubleSide });
  // Edge lines — solid white
  const matEdgeLine    = new THREE.MeshBasicMaterial({ color: 0xeeeeee, side: THREE.DoubleSide });
  // Centre line — dashed yellow for haul, solid white for normal
  const matCentreYellow = new THREE.MeshBasicMaterial({ color: 0xffcc00, side: THREE.DoubleSide });
  const matCentreWhite  = new THREE.MeshBasicMaterial({ color: 0xdddddd, side: THREE.DoubleSide });
  // Pit road amber centre
  const matCentrePit    = new THREE.MeshBasicMaterial({ color: 0xd4a44c, side: THREE.DoubleSide });
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
  const roadCurves = new Map();
  const OX = 75, OY = 225;

  // Smooth, grade-limited 3D road generator – uses terrain sampling + Gaussian smoothing
  // + 15 % grade clamping + CatmullRom spine so slopes are always mine-truck traversable.
  function createRoadGeometry(na, nb, width, heightOffset = 0, isPavement = false) {
    const geom = new THREE.BufferGeometry();
    
    const ax = na.x, az = na.z;
    const bx = nb.x, bz = nb.z;
    const dx = bx - ax;
    const dz = bz - az;
    const lenHorizontal = Math.hypot(dx, dz);
    if (lenHorizontal < 0.5) return new THREE.BufferGeometry();

    // --- Step 1: Dense terrain sample along centreline ---
    const SAMPLE_N = Math.max(24, Math.floor(lenHorizontal / 5));
    const rawY = new Float64Array(SAMPLE_N + 1);
    for (let si = 0; si <= SAMPLE_N; si++) {
      const t = si / SAMPLE_N;
      const wx = ax + dx * t, wz = az + dz * t;
      rawY[si] = getZ(wx + OX, wz + OY) * 0.4;
    }

    // --- Step 2: Multi-pass box-filter (simulates cut/fill earthworks grading) ---
    const SMOOTH_PASSES = 8;
    const SMOOTH_RADIUS = Math.max(3, Math.floor(SAMPLE_N / 10));
    const smY = rawY.slice();
    for (let pass = 0; pass < SMOOTH_PASSES; pass++) {
      const tmp = smY.slice();
      for (let si = 0; si <= SAMPLE_N; si++) {
        let sum = 0, cnt = 0;
        for (let k = -SMOOTH_RADIUS; k <= SMOOTH_RADIUS; k++) {
          const idx = si + k;
          if (idx >= 0 && idx <= SAMPLE_N) { sum += tmp[idx]; cnt++; }
        }
        smY[si] = sum / cnt;
      }
    }

    // --- Step 3: Grade clamping – max 15 % (real open-pit mine-haul limit) ---
    const MAX_GRADE = 0.15;
    const stepH = lenHorizontal / SAMPLE_N;
    const maxDY = MAX_GRADE * stepH;
    for (let si = 1; si <= SAMPLE_N; si++) {
      const delta = smY[si] - smY[si - 1];
      if (Math.abs(delta) > maxDY) smY[si] = smY[si - 1] + Math.sign(delta) * maxDY;
    }
    for (let si = SAMPLE_N - 1; si >= 0; si--) {
      const delta = smY[si] - smY[si + 1];
      if (Math.abs(delta) > maxDY) smY[si] = smY[si + 1] + Math.sign(delta) * maxDY;
    }

    // --- Step 4: CatmullRom spine through smoothed centreline ---
    const spinePoints = [];
    for (let si = 0; si <= SAMPLE_N; si++) {
      const t = si / SAMPLE_N;
      spinePoints.push(new THREE.Vector3(ax + dx * t, smY[si], az + dz * t));
    }
    const spine = new THREE.CatmullRomCurve3(spinePoints, false, 'catmullrom', 0.5);

    // --- Step 5: Tessellate ribbon along smooth spine ---
    const CURVE_SEGS = Math.max(24, Math.floor(lenHorizontal / 5));
    const widthSegments = isPavement ? 6 : 3;
    const vertices = [], indices = [], uvs = [];

    for (let i = 0; i <= CURVE_SEGS; i++) {
      const t   = i / CURVE_SEGS;
      const pos = spine.getPointAt(t);
      const tan = spine.getTangentAt(t).normalize();
      const flatTan = new THREE.Vector3(tan.x, 0, tan.z);
      if (flatTan.lengthSq() < 1e-9) flatTan.set(1, 0, 0); else flatTan.normalize();
      const perpX = -flatTan.z, perpZ = flatTan.x;
      const u = t * lenHorizontal;

      for (let j = 0; j <= widthSegments; j++) {
        const t_w = j / widthSegments;
        const off = t_w - 0.5;
        const vx = pos.x + perpX * (width * off);
        const vz = pos.z + perpZ * (width * off);
        let vy = pos.y + heightOffset;

        if (isPavement) {
          const dist = Math.abs(width * off);
          vy += fbm(vx * 0.08, vz * 0.08, 3) * 0.18;
          const rutCenter = 3.0, rutWidth = 1.6;
          const distToRut = Math.abs(dist - rutCenter);
          if (distToRut < rutWidth)
            vy -= 0.12 * (1.0 + Math.cos(distToRut * Math.PI / rutWidth));
        } else {
          vy += fbm(vx * 0.08, vz * 0.08, 3) * 0.10;
        }
        vertices.push(vx, vy, vz);
        uvs.push(u, t_w);
      }
    }

    const rowSize = widthSegments + 1;
    const N_top   = (CURVE_SEGS + 1) * rowSize;
    for (let i = 0; i < CURVE_SEGS; i++) {
      for (let j = 0; j < widthSegments; j++) {
        const v0 = i*rowSize+j, v1 = i*rowSize+j+1;
        const v2 = (i+1)*rowSize+j, v3 = (i+1)*rowSize+j+1;
        indices.push(v0,v1,v2); indices.push(v1,v3,v2);
      }
    }

    // Side walls extruded downward for 3-D volume
    const thickness = isPavement ? 1.4 : 0.9;
    for (let i = 0; i <= CURVE_SEGS; i++) {
      const t   = i / CURVE_SEGS;
      const pos = spine.getPointAt(t);
      const tan = spine.getTangentAt(t).normalize();
      const flatTan = new THREE.Vector3(tan.x, 0, tan.z);
      if (flatTan.lengthSq() < 1e-9) flatTan.set(1, 0, 0); else flatTan.normalize();
      const perpX = -flatTan.z, perpZ = flatTan.x;
      const u = t * lenHorizontal;

      const vx_l = pos.x + perpX*(width*-0.5), vz_l = pos.z + perpZ*(width*-0.5);
      const vy_l = pos.y + heightOffset + fbm(vx_l*0.08, vz_l*0.08, 3)*0.10;
      vertices.push(vx_l, vy_l - thickness, vz_l); uvs.push(u, 0);

      const vx_r = pos.x + perpX*(width*0.5), vz_r = pos.z + perpZ*(width*0.5);
      const vy_r = pos.y + heightOffset + fbm(vx_r*0.08, vz_r*0.08, 3)*0.10;
      vertices.push(vx_r, vy_r - thickness, vz_r); uvs.push(u, 1);
    }

    for (let i = 0; i < CURVE_SEGS; i++) {
      const tl = i*rowSize, tln = (i+1)*rowSize;
      const bl = N_top+i*2, bln = N_top+(i+1)*2;
      indices.push(tl, tln, bl); indices.push(tln, bln, bl);
      const tr = i*rowSize+widthSegments, trn = (i+1)*rowSize+widthSegments;
      const br = N_top+i*2+1, brn = N_top+(i+1)*2+1;
      indices.push(tr, br, trn); indices.push(trn, br, brn);
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.setAttribute('uv',       new THREE.Float32BufferAttribute(uvs, 2));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }

  function createSmoothRoadGeometry(pts, width, heightOffset = 0, isPavement = false) {
    if (pts.length < 2) return null;

    // Re-fit a CatmullRom through the input pts so the ribbon is smooth
    // between every supplied control point, then re-sample at fine intervals.
    const spine = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);

    // Compute total arc length for UV mapping
    let accumulatedLength = 0;
    for (let i = 0; i < pts.length - 1; i++) accumulatedLength += pts[i].distanceTo(pts[i + 1]);

    const CURVE_SEGS    = Math.max(24, pts.length * 4);
    const widthSegments = isPavement ? 6 : 3;
    const segStep       = accumulatedLength / CURVE_SEGS;

    const geom = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];
    const uvs = [];

    let currentU = 0;
    for (let i = 0; i <= CURVE_SEGS; i++) {
      const t   = i / CURVE_SEGS;
      const p   = spine.getPointAt(t);
      const tan = spine.getTangentAt(t).normalize();
      const flatTan = new THREE.Vector3(tan.x, 0, tan.z).normalize();
      if (flatTan.lengthSq() < 1e-9) flatTan.set(1, 0, 0);

      const perpX = -flatTan.z;
      const perpZ =  flatTan.x;

      for (let j = 0; j <= widthSegments; j++) {
        const t_w = j / widthSegments;
        const offsetFactor = t_w - 0.5;

        const vx = p.x + perpX * (width * offsetFactor);
        const vz = p.z + perpZ * (width * offsetFactor);
        let vy = p.y + heightOffset;

        if (isPavement) {
          const dist = Math.abs(width * offsetFactor);
          const noiseVal = fbm(vx * 0.08, vz * 0.08, 3) * 0.18;
          const rutCenter = 3.0;
          const rutWidth = 1.6;
          const distToRut = Math.abs(dist - rutCenter);
          let rutVal = 0;
          if (distToRut < rutWidth) {
            rutVal = -0.12 * (1.0 + Math.cos(distToRut * Math.PI / rutWidth));
          }
          vy += noiseVal + rutVal;
        } else {
          const noiseVal = fbm(vx * 0.08, vz * 0.08, 3) * 0.10;
          vy += noiseVal;
        }

        vertices.push(vx, vy, vz);
        uvs.push(currentU, t_w);
      }
      if (i < CURVE_SEGS) currentU += segStep;
    }

    const rowSize = widthSegments + 1;
    const N_top   = (CURVE_SEGS + 1) * rowSize;

    for (let i = 0; i < CURVE_SEGS; i++) {
      for (let j = 0; j < widthSegments; j++) {
        const v0 = i * rowSize + j,       v1 = i * rowSize + j + 1;
        const v2 = (i+1)*rowSize + j,     v3 = (i+1)*rowSize + j + 1;
        indices.push(v0, v1, v2);
        indices.push(v1, v3, v2);
      }
    }

    // Side walls
    const thickness = isPavement ? 1.4 : 0.9;
    currentU = 0;
    for (let i = 0; i <= CURVE_SEGS; i++) {
      const t   = i / CURVE_SEGS;
      const p   = spine.getPointAt(t);
      const tan = spine.getTangentAt(t).normalize();
      const flatTan = new THREE.Vector3(tan.x, 0, tan.z).normalize();
      if (flatTan.lengthSq() < 1e-9) flatTan.set(1, 0, 0);
      const perpX = -flatTan.z, perpZ = flatTan.x;

      const vx_l = p.x + perpX * (width * -0.5);
      const vz_l = p.z + perpZ * (width * -0.5);
      let vy_l = p.y + heightOffset + fbm(vx_l * 0.08, vz_l * 0.08, 3) * 0.10;
      vertices.push(vx_l, vy_l - thickness, vz_l);
      uvs.push(currentU, 0);

      const vx_r = p.x + perpX * (width * 0.5);
      const vz_r = p.z + perpZ * (width * 0.5);
      let vy_r = p.y + heightOffset + fbm(vx_r * 0.08, vz_r * 0.08, 3) * 0.10;
      vertices.push(vx_r, vy_r - thickness, vz_r);
      uvs.push(currentU, 1);

      if (i < CURVE_SEGS) currentU += segStep;
    }

    for (let i = 0; i < CURVE_SEGS; i++) {
      const tl_cur = i*rowSize,       tl_nxt = (i+1)*rowSize;
      const bl_cur = N_top + i*2,     bl_nxt = N_top + (i+1)*2;
      indices.push(tl_cur, tl_nxt, bl_cur);
      indices.push(tl_nxt, bl_nxt, bl_cur);

      const tr_cur = i*rowSize + widthSegments, tr_nxt = (i+1)*rowSize + widthSegments;
      const br_cur = N_top + i*2 + 1,           br_nxt = N_top + (i+1)*2 + 1;
      indices.push(tr_cur, br_cur, tr_nxt);
      indices.push(tr_nxt, br_cur, br_nxt);
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.setAttribute('uv',       new THREE.Float32BufferAttribute(uvs, 2));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }

  // Custom 3D safety berm (earth mound) geometry generator
  function createBermGeometry(na, nb, bermOffset, bermH, bermW) {
    const geom = new THREE.BufferGeometry();
    
    const ax = na.x, az = na.z;
    const bx = nb.x, bz = nb.z;
    const dx = bx - ax;
    const dz = bz - az;
    const lenHorizontal = Math.hypot(dx, dz);
    
    const segments = Math.max(8, Math.floor(lenHorizontal / 10));
    const vertices = [];
    const indices = [];

    const dirX = dx / lenHorizontal;
    const dirZ = dz / lenHorizontal;
    const perpX = -dirZ;
    const perpZ = dirX;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const wx = ax + dx * t;
      const wz = az + dz * t;
      const wy = getZ(wx + OX, wz + OY) * 0.4 + 0.02; // shoulder height

      // Left base of the berm
      const lx = wx + perpX * (bermOffset - bermW / 2);
      const lz = wz + perpZ * (bermOffset - bermW / 2);
      
      // Right base of the berm
      const rx = wx + perpX * (bermOffset + bermW / 2);
      const rz = wz + perpZ * (bermOffset + bermW / 2);
      
      // Top center of the berm
      const tx = wx + perpX * bermOffset;
      const tz = wz + perpZ * bermOffset;
      const ty = wy + bermH;

      vertices.push(lx, wy, lz); // 0
      vertices.push(rx, wy, rz); // 1
      vertices.push(tx, ty, tz); // 2
    }

    for (let i = 0; i < segments; i++) {
      const base = i * 3;
      const next = (i + 1) * 3;

      // Triangle 1: left side (lx_i, tx_i, lx_next)
      indices.push(base, base + 2, next);
      // Triangle 2: left side next (tx_i, tx_next, lx_next)
      indices.push(base + 2, next + 2, next);

      // Triangle 3: right side (tx_i, rx_i, tx_next)
      indices.push(base + 2, base + 1, next + 2);
      // Triangle 4: right side next (rx_i, rx_next, tx_next)
      indices.push(base + 1, next + 1, next + 2);
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();

    return geom;
  }

  for (const [a, b] of EDGES) {
    const na = NODES[a], nb = NODES[b];
    if (!na || !nb) continue;

    const dx = nb.x - na.x;
    const dz = nb.z - na.z;
    const lenHorizontal = Math.hypot(dx, dz);
    if (lenHorizontal < 0.5) continue;

    // Build smooth grade-limited spine for truck pathfinding (mirrors createRoadGeometry logic)
    {
      const SAMPLE_N = Math.max(24, Math.floor(lenHorizontal / 5));
      const rawY = new Float64Array(SAMPLE_N + 1);
      for (let si = 0; si <= SAMPLE_N; si++) {
        const t  = si / SAMPLE_N;
        const wx = na.x + dx * t, wz = na.z + dz * t;
        rawY[si] = getZ(wx + OX, wz + OY) * 0.4;
      }
      // Box-filter smoothing
      const SMOOTH_PASSES = 6, SMOOTH_RADIUS = Math.max(2, Math.floor(SAMPLE_N / 12));
      const smY = rawY.slice();
      for (let pass = 0; pass < SMOOTH_PASSES; pass++) {
        const tmp = smY.slice();
        for (let si = 0; si <= SAMPLE_N; si++) {
          let sum = 0, cnt = 0;
          for (let k = -SMOOTH_RADIUS; k <= SMOOTH_RADIUS; k++) {
            const idx = si + k;
            if (idx >= 0 && idx <= SAMPLE_N) { sum += tmp[idx]; cnt++; }
          }
          smY[si] = sum / cnt;
        }
      }
      // Grade clamping – max 15 %
      const MAX_GRADE = 0.15, stepH = lenHorizontal / SAMPLE_N, maxDY = MAX_GRADE * stepH;
      for (let si = 1; si <= SAMPLE_N; si++) {
        const delta = smY[si] - smY[si - 1];
        if (Math.abs(delta) > maxDY) smY[si] = smY[si - 1] + Math.sign(delta) * maxDY;
      }
      for (let si = SAMPLE_N - 1; si >= 0; si--) {
        const delta = smY[si] - smY[si + 1];
        if (Math.abs(delta) > maxDY) smY[si] = smY[si + 1] + Math.sign(delta) * maxDY;
      }
      const spinePoints = [];
      for (let si = 0; si <= SAMPLE_N; si++) {
        const t = si / SAMPLE_N;
        spinePoints.push(new THREE.Vector3(na.x + dx * t, smY[si] + 0.06, na.z + dz * t));
      }
      const curve = new THREE.CatmullRomCurve3(spinePoints, false, 'catmullrom', 0.5);
      roadCurves.set(`${a}_${b}`, curve);
      roadCurves.set(`${b}_${a}`, new THREE.CatmullRomCurve3([...spinePoints].reverse(), false, 'catmullrom', 0.5));
    }

    const isHaul  = mainHaulSet.has(a) || mainHaulSet.has(b);
    const isPitRd = PIT_ROAD_NODES.has(a) && PIT_ROAD_NODES.has(b);

    // Road dimensions
    const paveW    = isHaul ? 20 : (isPitRd ? 14 : 12);
    const shouldW  = paveW + 8;
    const paveH    = 0.4; // thickness standard

    /* ─── Layer 1: Gravel shoulder bed (sits underneath) ─── */
    const shoulderGeom = createRoadGeometry(na, nb, shouldW, 0.02, false);
    const shoulderMesh = new THREE.Mesh(shoulderGeom, isPitRd ? matGravelPit : matGravel);
    shoulderMesh.receiveShadow = true;
    scene.add(shoulderMesh);
    teleportTargets.push(shoulderMesh);

    /* ─── Layer 2: Dirt road pavement surface ─── */
    const ratio = Math.max(1, Math.min(8, Math.round(lenHorizontal / paveW)));
    const paveMat = isPitRd ? matAsphaltPitPool[ratio - 1] : (isHaul ? matAsphaltHaulPool[ratio - 1] : matAsphaltPool[ratio - 1]);
    const paveGeom = createRoadGeometry(na, nb, paveW, 0.06, true);
    const pavementMesh = new THREE.Mesh(paveGeom, paveMat);
    pavementMesh.castShadow = true;
    pavementMesh.receiveShadow = true;
    scene.add(pavementMesh);
    teleportTargets.push(pavementMesh);

    /* ─── Layer 3: Edge lines ─── */
    const edgeOffset = paveW / 2 - 0.5;
    const lineW = 0.6;

    // Left edge line
    const leftLineGeom = createRoadGeometry(na, nb, lineW, 0.08, false);
    const leftPos = leftLineGeom.attributes.position;
    const perpX = -dz / lenHorizontal, perpZ = dx / lenHorizontal;
    for (let i = 0; i < leftPos.count; i++) {
      leftPos.setX(i, leftPos.getX(i) - perpX * edgeOffset);
      leftPos.setZ(i, leftPos.getZ(i) - perpZ * edgeOffset);
    }
    leftLineGeom.computeVertexNormals();
    const leftLineMesh = new THREE.Mesh(leftLineGeom, isPitRd ? matCentrePit : matEdgeLine);
    scene.add(leftLineMesh);

    // Right edge line
    const rightLineGeom = createRoadGeometry(na, nb, lineW, 0.08, false);
    const rightPos = rightLineGeom.attributes.position;
    for (let i = 0; i < rightPos.count; i++) {
      rightPos.setX(i, rightPos.getX(i) + perpX * edgeOffset);
      rightPos.setZ(i, rightPos.getZ(i) + perpZ * edgeOffset);
    }
    rightLineGeom.computeVertexNormals();
    const rightLineMesh = new THREE.Mesh(rightLineGeom, isPitRd ? matCentrePit : matEdgeLine);
    scene.add(rightLineMesh);

    /* ─── Layer 4: Centre markings ─── */
    if (!isHaul) {
      // Solid centre line
      const centerLineW = isPitRd ? 1.2 : 0.7;
      const centerLineGeom = createRoadGeometry(na, nb, centerLineW, 0.08, false);
      const centerLineMesh = new THREE.Mesh(centerLineGeom, isPitRd ? matCentrePit : matCentreWhite);
      scene.add(centerLineMesh);
    } else {
      // Dashed yellow centre line for haul roads
      const dashLen = 6, gapLen = 4;
      const totalCycle = dashLen + gapLen;
      const numDashes = Math.floor(lenHorizontal / totalCycle);
      const centerLineW = 1.0;
      for (let d = 0; d < numDashes; d++) {
        const tStart = (d * totalCycle + gapLen/2) / lenHorizontal;
        const tEnd   = (d * totalCycle + gapLen/2 + dashLen) / lenHorizontal;
        if (tEnd > 1) break;

        const dsx = na.x + dx * tStart, dsz = na.z + dz * tStart;
        const dex = na.x + dx * tEnd,   dez = na.z + dz * tEnd;
        
        const dna = { x: dsx, z: dsz };
        const dnb = { x: dex, z: dez };

        const dashGeom = createRoadGeometry(dna, dnb, centerLineW, 0.08, false);
        const dashMesh = new THREE.Mesh(dashGeom, matCentreYellow);
        scene.add(dashMesh);
      }
    }

    /* ─── Layer 5: Safety earth/rock berms ─── */
    if (isPitRd || isHaul) {
      const bermH = 3.0, bermW = 2.5;
      const bermOffset = paveW / 2 + 1.2;
      for (const side of [-1, 1]) {
        const bermGeom = createBermGeometry(na, nb, bermOffset * side, bermH, bermW);
        const bermMesh = new THREE.Mesh(bermGeom, isPitRd ? matGravelPit : matGravel);
        bermMesh.castShadow = true;
        bermMesh.receiveShadow = true;
        scene.add(bermMesh);
      }
    }

    /* ─── Layer 5: Pit road extras — bollards + chevrons ─── */
    if (isPitRd) {
      const railOffset = paveW / 2 + 1.5;

      const bollardSpacing = 40;
      const numBollards = Math.max(2, Math.floor(lenHorizontal / bollardSpacing));
      for (let bi = 0; bi <= numBollards; bi++) {
        const tVal = bi / numBollards;
        const pos = curve.getPointAt(tVal);
        const tangent = curve.getTangentAt(tVal);
        const perpVec = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

        for (const side of [-1, 1]) {
          const bx = pos.x + perpVec.x * railOffset * side;
          const by = pos.y;
          const bz = pos.z + perpVec.z * railOffset * side;

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

      // Slope direction chevrons
      const na_y = na.y;
      const nb_y = nb.y;
      if (Math.abs(na_y - nb_y) > 0.3) {
        const downhill = nb_y < na_y ? 1 : -1;
        const chevSpacing = 25;
        const numChevs = Math.max(1, Math.floor(lenHorizontal / chevSpacing));
        const matChevron = new THREE.MeshBasicMaterial({
          color: 0xffffff, transparent: true, opacity: 0.9, side: THREE.DoubleSide
        });

        for (let ci = 1; ci <= numChevs; ci++) {
          const tVal = ci / (numChevs + 1);
          const pos = curve.getPointAt(tVal);
          const tangent = curve.getTangentAt(tVal);

          // V-shaped chevron pointing downhill
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

          const flatDir = new THREE.Vector3(tangent.x * downhill, 0, tangent.z * downhill).normalize();
          const angle = Math.atan2(flatDir.x, flatDir.z);
          chev.rotation.z = -angle;
          chev.position.set(pos.x, pos.y + 0.08, pos.z);
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

  // Pits outlines removed to display paths only

  /* ════════════════════════════════════════════════
     TRUCKS — vivid orange, easy to spot
  ════════════════════════════════════════════════ */
  const truckRoutes  = getTruckRoutes(20);
  const truckObjects = [];
  const raycaster    = new THREE.Raycaster();
  const mouse        = new THREE.Vector2();

  function makeTruck(id) {
    const g = new THREE.Group();

    // Chassis
    const chassis = new THREE.Mesh(
      new THREE.BoxGeometry(26, 6, 12),
      stdMat({ color: 0x222222, roughness: 0.8, metalness: 0.6 })
    );
    chassis.position.set(0, 6, 0);
    chassis.castShadow = true;
    g.add(chassis);

    // Dump Bed
    const bed = new THREE.Mesh(
      new THREE.BoxGeometry(28, 12, 20),
      stdMat({ color: C.truckBody, emissive: C.truckBody, emissiveIntensity: 0.1, roughness: 0.5, metalness: 0.3 })
    );
    bed.position.set(2, 14, 0); 
    bed.rotation.z = -0.05; // slight angle
    bed.castShadow = true; 
    g.add(bed);

    // Cabin
    const cab = new THREE.Mesh(
      new THREE.BoxGeometry(8, 8, 10),
      stdMat({ color: C.truckCab, emissive: C.truckCab, emissiveIntensity: 0.1, roughness: 0.4, metalness: 0.4 })
    );
    cab.position.set(-10, 13, 3);
    cab.castShadow = true;
    g.add(cab);

    // Walkway Platform
    const walkway = new THREE.Mesh(
      new THREE.BoxGeometry(6, 1, 18),
      stdMat({ color: 0x333333, roughness: 0.9 })
    );
    walkway.position.set(-14, 9, 0);
    g.add(walkway);
    
    // Radiator Grille
    const grille = new THREE.Mesh(
      new THREE.BoxGeometry(2, 8, 8),
      stdMat({ color: 0x111111, roughness: 0.8, metalness: 0.8 })
    );
    grille.position.set(-14, 7, 0);
    g.add(grille);
    
    // Exhaust pipe
    const exhaust = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 6),
      stdMat({ color: 0x555555, metalness: 0.8 })
    );
    exhaust.position.set(-10, 18, -4);
    g.add(exhaust);
    
    // Hydraulic cylinders
    for (const z of [-6, 6]) {
      const hyd = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 0.8, 10),
        stdMat({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.2 })
      );
      hyd.rotation.z = Math.PI / 6;
      hyd.position.set(-4, 10, z);
      g.add(hyd);
    }

    /* Headlights */
    for (const z of [-6, 6]) {
      const hl = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 2.5, 2.5),
        new THREE.MeshBasicMaterial({ color: C.truckHL })
      );
      hl.position.set(-15, 8, z); 
      g.add(hl);
      
      const hlLight = new THREE.PointLight(C.truckHL, 0.8, 50);
      hlLight.position.set(-16, 8, z);
      g.add(hlLight);
    }

    /* Massive Wheels */
    const wMat = stdMat({ color: C.truckWheel, roughness: 0.9, metalness: 0.1 });
    const hubMat = stdMat({ color: 0x777777, metalness: 0.8 });
    for (const [wx, wz] of [[-10,-10],[-10,10],[10,-10],[10,10]]) {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 5.5, 6, 16), wMat);
      w.rotation.x = Math.PI/2;
      w.position.set(wx, 5.5, wz);
      w.castShadow = true;
      g.add(w);
      
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 6.2, 8), hubMat);
      hub.rotation.x = Math.PI/2;
      hub.position.set(wx, 5.5, wz);
      g.add(hub);
    }

    /* Floating Cyan Hex-icon */
    const hexGrp = new THREE.Group();
    hexGrp.position.set(0, 32, 0);
    hexGrp.name = "hexIcon";
    
    const hexRing = new THREE.Mesh(
      new THREE.RingGeometry(3, 4, 6),
      new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
    );
    const hexGlow = new THREE.Mesh(
      new THREE.RingGeometry(2, 5, 6),
      new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide, transparent: true, opacity: 0.3 })
    );
    // Align hex to face camera initially or rotate flat
    hexRing.rotation.x = Math.PI/2;
    hexGlow.rotation.x = Math.PI/2;
    
    hexGrp.add(hexRing);
    hexGrp.add(hexGlow);
    
    /* Clean cyan text label */
    const lbl = makeLabel(id, {
      bgColor: "rgba(0, 30, 40, 0.7)", textColor: "#00ffff",
      fontSize: 16, width: 140, height: 40,
    });
    lbl.position.set(12, 0, 0); 
    hexGrp.add(lbl);

    g.add(hexGrp);

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

    const homePos = new THREE.Vector3(pos.x, pos.y, pos.z);
    const currentPos = new THREE.Vector3(pos.x, pos.y, pos.z);
    const towerId = td._id ?? `TWR${String(i+1).padStart(3,"0")}`;

    /* Detailed Truss Tower */
    const towerGrp = new THREE.Group();
    towerGrp.position.set(currentPos.x, currentPos.y, currentPos.z);
    
    const legGeo = new THREE.CylinderGeometry(0.8, 1.5, 85, 4);
    const legMat = stdMat({ color: C.towerMast, emissive: C.towerMast, emissiveIntensity: 0.1, roughness: 0.7, metalness: 0.8 });
    
    // 4 legs
    for (const [x, z] of [[-3,-3], [3,-3], [3,3], [-3,3]]) {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, 42.5, z);
      // Slant inward
      leg.rotation.x = -z * 0.02;
      leg.rotation.z = x * 0.02;
      leg.castShadow = true;
      towerGrp.add(leg);
    }
    
    // Horizontal braces
    for (let h = 10; h <= 70; h += 15) {
      const braceSize = 6 - (h / 85) * 3;
      const braceGeo = new THREE.BoxGeometry(braceSize * 2, 0.5, braceSize * 2);
      const brace = new THREE.Mesh(braceGeo, legMat);
      brace.position.y = h;
      towerGrp.add(brace);
    }
    
    /* Top platform */
    const platform = new THREE.Mesh(
      new THREE.BoxGeometry(10, 1.5, 10),
      stdMat({ color: 0x334455, roughness: 0.8, metalness: 0.9 })
    );
    platform.position.y = 85;
    towerGrp.add(platform);
    
    /* Satellite Dish Antennas */
    for (const rot of [0, Math.PI]) {
      const dish = new THREE.Mesh(
        new THREE.SphereGeometry(2.5, 12, 12, 0, Math.PI),
        stdMat({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.4 })
      );
      dish.position.set(rot === 0 ? 5 : -5, 87, 0);
      dish.rotation.y = rot;
      dish.rotation.x = Math.PI / 8; // pointing slightly up
      towerGrp.add(dish);
    }

    /* Vertical rod / Beacon support */
    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 10),
      legMat
    );
    rod.position.y = 90;
    towerGrp.add(rod);

    /* Beacon */
    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(3, 14, 14),
      new THREE.MeshBasicMaterial({ color: C.beacon })
    );
    beacon.position.y = 95;
    beacon.userData.pulse = true;
    beacon.userData.pulseOffset = i * 0.5;
    towerGrp.add(beacon);

    const bLight = new THREE.PointLight(C.beacon, 4, 150);
    bLight.position.copy(beacon.position);
    towerGrp.add(bLight);

    scene.add(towerGrp);

    /* Spherical Coverage Signal Area (Geodesic) */
    const covR = (td.coverageRadius ?? 200) * COV_SCALE;

    const sphereGeo = new THREE.IcosahedronGeometry(covR, 2);
    
    // Transparent solid coverage sphere
    const coverageSphere = new THREE.Mesh(
      sphereGeo,
      new THREE.MeshBasicMaterial({
        color: C.coverage,
        transparent: true,
        opacity: 0.04,
        depthWrite: false,
      })
    );
    coverageSphere.position.set(currentPos.x, currentPos.y + 95, currentPos.z);
    scene.add(coverageSphere);

    // Holographic wireframe coverage sphere
    const coverageWire = new THREE.Mesh(
      sphereGeo,
      new THREE.MeshBasicMaterial({
        color: C.coverage,
        transparent: true,
        opacity: 0.15,
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
      towerGrp,
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

  /* ── Dust Particle System for Trucks ── */
  const dustParticles = [];
  const dustGeo = new THREE.SphereGeometry(3.5, 6, 6);
  const baseDustMat = new THREE.MeshBasicMaterial({
    color: 0xa5927e,
    transparent: true,
    opacity: 0.15,
    depthWrite: false
  });

  function spawnDust(x, y, z, rotY) {
    const backX = Math.sin(rotY);
    const backZ = Math.cos(rotY);
    const perpX = -backZ;
    const perpZ = backX;

    const wheelOffset = 7;
    const wheels = [
      { x: x - backX * 12 + perpX * wheelOffset, z: z - backZ * 12 + perpZ * wheelOffset },
      { x: x - backX * 12 - perpX * wheelOffset, z: z - backZ * 12 - perpZ * wheelOffset }
    ];

    for (const w of wheels) {
      const mesh = new THREE.Mesh(dustGeo, baseDustMat.clone());
      mesh.position.set(w.x, y, w.z);
      scene.add(mesh);

      dustParticles.push({
        mesh,
        age: 0,
        maxAge: 40 + Math.floor(Math.random() * 20),
        velocity: new THREE.Vector3(
          -backX * (0.8 + Math.random() * 0.8) + (Math.random() - 0.5) * 0.4,
          0.1 + Math.random() * 0.2,
          -backZ * (0.8 + Math.random() * 0.8) + (Math.random() - 0.5) * 0.4
        )
      });
    }
  }

  function updateDustParticles() {
    for (let i = dustParticles.length - 1; i >= 0; i--) {
      const p = dustParticles[i];
      p.age++;
      if (p.age >= p.maxAge) {
        scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        dustParticles.splice(i, 1);
      } else {
        p.mesh.position.add(p.velocity);
        p.velocity.multiplyScalar(0.96);
        
        const scale = 1.0 + (p.age / p.maxAge) * 3.5;
        p.mesh.scale.set(scale, scale, scale);
        p.mesh.material.opacity = 0.15 * (1 - p.age / p.maxAge);
      }
    }
  }

  /* ════════════════════════════════════════════════
     ANIMATION
  ════════════════════════════════════════════════ */
  const SPEED = 0.004;
  let frame = 0, animId;

  function animate() {
    frame++;

    /* ── VR Teleport Raycasting ── */
    if (renderer.xr.isPresenting) {
      teleportMarker.visible = false;
      for (const controller of controllers) {
        if (controller.userData.isSelecting) {
          tempMatrix.identity().extractRotation(controller.matrixWorld);
          const origin = new THREE.Vector3().setFromMatrixPosition(controller.matrixWorld);
          const direction = new THREE.Vector3(0, 0, -1).applyMatrix4(tempMatrix);
          
          vrRaycaster.ray.origin.copy(origin);
          vrRaycaster.ray.direction.copy(direction);
          
          const intersects = vrRaycaster.intersectObjects(teleportTargets, false);
          if (intersects.length > 0) {
            const hit = intersects[0];
            teleportMarker.position.copy(hit.point);
            teleportMarker.visible = true;
            break;
          }
        }
      }
    }

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
      const fromNode = t.currentPath[ai];
      const toNode = t.currentPath[bi];
      const curveKey = `${fromNode}_${toNode}`;
      const curve = roadCurves.get(curveKey);
      if (curve) {
        const pos = curve.getPointAt(t.progress);
        t.mesh.position.copy(pos);
        t.mesh.position.y += 9.0;

        const tangent = curve.getTangentAt(t.progress);
        t.mesh.rotation.y = Math.atan2(tangent.x, tangent.z);
      } else {
        const na = NODES[fromNode];
        const nb = NODES[toNode];
        if (na && nb) {
          t.mesh.position.x = na.x + (nb.x - na.x) * t.progress;
          t.mesh.position.z = na.z + (nb.z - na.z) * t.progress;
          const involvesPit = PIT_ROAD_NODES.has(fromNode) || PIT_ROAD_NODES.has(toNode);
          t.mesh.position.y = involvesPit
            ? (na.y + (nb.y - na.y) * t.progress + 9)
            : (getZ(t.mesh.position.x + 75, t.mesh.position.z + 225) * 0.04 + 9);
          t.mesh.rotation.y = Math.atan2(nb.x - na.x, nb.z - na.z);
        }
      }

      // Rotate hex icon
      const hexIcon = t.mesh.getObjectByName("hexIcon");
      if (hexIcon) {
        hexIcon.rotation.y += 0.05;
      }

      // Spawn dust clouds every 3 frames if truck is moving
      if (frame % 3 === 0) {
        spawnDust(t.mesh.position.x, t.mesh.position.y - 5, t.mesh.position.z, t.mesh.rotation.y);
      }
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

      // Compute actual position (clamping to the curved road path)
      const fromNode = tower.currentNodeName;
      const toNode = tower.nextNodeName;
      const curveKey = `${fromNode}_${toNode}`;
      const curve = roadCurves.get(curveKey);
      if (curve) {
        const pos = curve.getPointAt(tower.progress);
        tower.currentPos.copy(pos);
      } else {
        const na = NODES[fromNode];
        const nb = NODES[toNode];
        if (na && nb) {
          tower.currentPos.x = na.x + (nb.x - na.x) * tower.progress;
          tower.currentPos.z = na.z + (nb.z - na.z) * tower.progress;
          const involvesPit = PIT_ROAD_NODES.has(fromNode) || PIT_ROAD_NODES.has(toNode);
          tower.currentPos.y = involvesPit
            ? (na.y + (nb.y - na.y) * tower.progress)
            : (getZ(tower.currentPos.x + 75, tower.currentPos.z + 225) * 0.04);
        }
      }

      // Update Three.js node positions for tower elements
      if (tower.towerGrp) {
        tower.towerGrp.position.copy(tower.currentPos);
      }
      
      if (tower.coverageSphere) {
        tower.coverageSphere.position.set(tower.currentPos.x, tower.currentPos.y + 95, tower.currentPos.z);
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
    updateDustParticles();

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
  renderer.setAnimationLoop(animate);

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
    sendCommand: (action, value, entityId = null) => {
      if (ws && ws.readyState === 1) {
        const payload = { action, value };
        if (entityId !== null) payload.id = entityId;
        ws.send(JSON.stringify(payload));
        console.log("[ws] Sent command:", payload);
      }
    },
    cleanup: () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("click", onContainerClick);
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
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
