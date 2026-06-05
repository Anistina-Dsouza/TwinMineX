import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createHeatmapOverlay } from "./heatmap";

export function createScene(container, towers, routes, onTruckSelect, onSceneReady) {

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x040e1a);
  scene.fog = new THREE.FogExp2(0x040e1a, 0.00042);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // =========================
  // CAMERA
  // =========================
  const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 5000);
  camera.position.set(500, 600, 1100);

  // =========================
  // RENDERER
  // =========================
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // =========================
  // CONTROLS
  // =========================
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.target.set(500, 0, 500);
  controls.minDistance = 200;
  controls.maxDistance = 1800;
  controls.minPolarAngle = Math.PI / 6;
  controls.maxPolarAngle = Math.PI / 2.15;
  controls.update();

  // =========================
  // GROUND
  // =========================
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshStandardMaterial({ color: 0x1a2a1a, roughness: 0.95, metalness: 0.05 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(500, 0, 500);
  scene.add(ground);

  const grid = new THREE.GridHelper(1000, 50, 0x004455, 0x002233);
  grid.position.set(500, 0.5, 500);
  scene.add(grid);

  // =========================
  // HEATMAP OVERLAY
  // =========================
  const heatmap = createHeatmapOverlay(scene, 1000, { x: 500, z: 500 });

  // =========================
  // LIGHTS
  // =========================
  scene.add(new THREE.AmbientLight(0x112244, 1.5));
  const sun = new THREE.DirectionalLight(0x8888ff, 1.5);
  sun.position.set(300, 500, 300);
  scene.add(sun);
  const fillLight = new THREE.PointLight(0x004488, 2, 1200);
  fillLight.position.set(500, 200, 500);
  scene.add(fillLight);
  const rimLight = new THREE.PointLight(0x00c8ff, 1.5, 600);
  rimLight.position.set(100, 150, 100);
  scene.add(rimLight);

  // =========================
  // ZONES
  // =========================
  function createZone(x, z, color, size, emissive) {
    const mat = new THREE.MeshStandardMaterial({ color, emissive: emissive ?? color, emissiveIntensity: 0.2, roughness: 0.7 });
    const zone = new THREE.Mesh(new THREE.CylinderGeometry(size, size, 6, 32), mat);
    zone.position.set(x, 3, z);
    scene.add(zone);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(size + 2, size + 8, 64),
      new THREE.MeshBasicMaterial({ color: emissive ?? color, transparent: true, opacity: 0.25, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(x, 1, z);
    scene.add(ring);
  }

  const pitA          = { x: 250, z: 250 };
  const pitB          = { x: 750, z: 250 };
  const dumpSite      = { x: 500, z: 750 };
  const controlCenter = { x: 500, z: 100 };

  createZone(pitA.x,          pitA.z,          0x7a3b10, 80,  0xff6600);
  createZone(pitB.x,          pitB.z,          0x7a3b10, 80,  0xff6600);
  createZone(dumpSite.x,      dumpSite.z,      0x444455, 100, 0x8888ff);
  createZone(controlCenter.x, controlCenter.z, 0x003388, 60,  0x0088ff);

  // =========================
  // ROADS
  // =========================
  function createRoad(sx, sz, ex, ez) {
    const dx = ex - sx, dz = ez - sz;
    const len = Math.sqrt(dx*dx + dz*dz);
    const road = new THREE.Mesh(
      new THREE.BoxGeometry(len, 0.5, 18),
      new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.9 })
    );
    road.position.set((sx+ex)/2, 0.3, (sz+ez)/2);
    road.rotation.y = Math.atan2(dz, dx);
    scene.add(road);
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(len, 0.6, 2),
      new THREE.MeshBasicMaterial({ color: 0x334455 })
    );
    line.position.copy(road.position); line.position.y = 0.6;
    line.rotation.y = road.rotation.y;
    scene.add(line);
  }

  createRoad(pitA.x, pitA.z, dumpSite.x, dumpSite.z);
  createRoad(pitB.x, pitB.z, dumpSite.x, dumpSite.z);
  createRoad(controlCenter.x, controlCenter.z, dumpSite.x, dumpSite.z);

  // =========================
  // TOWERS
  // =========================
  towers.forEach((td) => {
    const mast = new THREE.Mesh(
      new THREE.CylinderGeometry(3, 5, 110, 8),
      new THREE.MeshStandardMaterial({ color: 0x223344, roughness: 0.6, metalness: 0.4 })
    );
    mast.position.set(td.x, 55, td.z);
    scene.add(mast);

    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(6, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x00ff9d })
    );
    beacon.position.set(td.x, 114, td.z);
    beacon.userData.pulse = true;
    scene.add(beacon);

    const beaconLight = new THREE.PointLight(0x00ff9d, 2, 200);
    beaconLight.position.set(td.x, 114, td.z);
    scene.add(beaconLight);

    const coverage = new THREE.Mesh(
      new THREE.CircleGeometry(td.coverageRadius, 72),
      new THREE.MeshBasicMaterial({ color: 0x00ff9d, transparent: true, opacity: 0.05, side: THREE.DoubleSide })
    );
    coverage.rotation.x = -Math.PI / 2;
    coverage.position.set(td.x, 0.3, td.z);
    scene.add(coverage);

    const covRing = new THREE.Mesh(
      new THREE.RingGeometry(td.coverageRadius - 3, td.coverageRadius + 3, 72),
      new THREE.MeshBasicMaterial({ color: 0x00ff9d, transparent: true, opacity: 0.3, side: THREE.DoubleSide })
    );
    covRing.rotation.x = -Math.PI / 2;
    covRing.position.set(td.x, 0.4, td.z);
    scene.add(covRing);
  });

  // =========================
  // LABEL
  // =========================
  function createLabel(text) {
    const canvas = document.createElement("canvas");
    canvas.width = 256; canvas.height = 64;
    const ctx = canvas.getContext("2d");
    ctx.font = "bold 22px monospace";
    ctx.fillStyle = "#00c8ff";
    ctx.shadowColor = "#00c8ff"; ctx.shadowBlur = 8;
    ctx.fillText(text, 8, 42);
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true })
    );
    sprite.scale.set(55, 14, 1);
    return sprite;
  }

  // =========================
  // TRUCKS
  // =========================
  const truckObjects = [];

  routes.forEach((route, index) => {
    const truck = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(40, 14, 22),
      new THREE.MeshStandardMaterial({ color: 0xe87010, roughness: 0.5, metalness: 0.3 })
    );
    body.position.y = 10; truck.add(body);

    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(14, 11, 20),
      new THREE.MeshStandardMaterial({ color: 0xcc5500, roughness: 0.4, metalness: 0.4 })
    );
    cabin.position.set(-12, 19, 0); truck.add(cabin);

    [-9, 9].forEach(z => {
      const hl = new THREE.Mesh(
        new THREE.BoxGeometry(2, 3, 3),
        new THREE.MeshBasicMaterial({ color: 0xffffaa })
      );
      hl.position.set(-20, 12, z); truck.add(hl);
    });

    for (let x of [-14, 14]) {
      for (let z of [-10, 10]) {
        const wheel = new THREE.Mesh(
          new THREE.CylinderGeometry(5, 5, 5, 12),
          new THREE.MeshStandardMaterial({ color: 0x111122, roughness: 0.9 })
        );
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(x, 5, z); truck.add(wheel);
      }
    }

    const sourcePit = index < routes.length / 2 ? pitA : pitB;
    truck.position.set(
      sourcePit.x + (Math.random() * 100 - 50), 8,
      sourcePit.z + (Math.random() * 100 - 50)
    );
    truck.userData.type = "truck";

    const label = createLabel(`TRK${String(index + 1).padStart(3, "0")}`);
    label.position.set(0, 38, 0);
    truck.add(label);
    scene.add(truck);

    truckObjects.push({
      mesh: truck,
      id: `TRK${String(index + 1).padStart(3, "0")}`,
      speed:   Math.floor(25 + Math.random() * 20),
      signal:  Math.floor(60 + Math.random() * 40),
      fuel:    Math.floor(60 + Math.random() * 40),
      battery: Math.floor(70 + Math.random() * 30),
      latency: Math.floor(10 + Math.random() * 20),
      start: sourcePit,
      progress: Math.random(),
      returning: false,
    });
  });

  // Expose heatmap update to animation loop
  heatmap.update(truckObjects);

  // Tell React the scene + heatmap toggle are ready
  onSceneReady?.({ heatmap });

  // =========================
  // CLICK
  // =========================
  function onContainerClick(event) {
    const rect = container.getBoundingClientRect();
    mouse.x =  ((event.clientX - rect.left) / rect.width)  * 2 - 1;
    mouse.y = -((event.clientY - rect.top)  / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const hits = raycaster.intersectObjects(truckObjects.map(t => t.mesh), true);
    if (hits.length > 0) {
      const hit = hits[0].object;
      const found = truckObjects.find(t => t.mesh === hit || t.mesh.children.includes(hit));
      if (found) {
        truckObjects.forEach(t => t.mesh.traverse(c => {
          if (c.isMesh && c.material.emissive) { c.material.emissive.set(0x000000); c.material.emissiveIntensity = 0; }
        }));
        found.mesh.traverse(c => {
          if (c.isMesh && c.material.emissive) { c.material.emissive.set(0x00c8ff); c.material.emissiveIntensity = 0.6; }
        });
        onTruckSelect?.(found);
        return;
      }
    }
    truckObjects.forEach(t => t.mesh.traverse(c => {
      if (c.isMesh && c.material.emissive) { c.material.emissive.set(0x000000); c.material.emissiveIntensity = 0; }
    }));
    onTruckSelect?.(null);
  }

  // =========================
  // ANIMATION
  // =========================
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame++;

    truckObjects.forEach(truck => {
      truck.progress += 0.0015;
      if (truck.progress >= 1) { truck.progress = 0; truck.returning = !truck.returning; }
      const from = truck.returning ? dumpSite : truck.start;
      const to   = truck.returning ? truck.start : dumpSite;
      truck.mesh.position.x = from.x + (to.x - from.x) * truck.progress;
      truck.mesh.position.z = from.z + (to.z - from.z) * truck.progress;
      truck.mesh.rotation.y = Math.atan2(to.x - from.x, to.z - from.z);
    });

    // Update heatmap every 60 frames
    if (frame % 60 === 0) heatmap.update(truckObjects);

    // Pulse beacon
    scene.traverse(obj => {
      if (obj.userData?.pulse) obj.material.opacity = 0.6 + 0.4 * Math.sin(frame * 0.05);
    });

    controls.update();
    renderer.render(scene, camera);
  }

  const handleResize = () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };

  window.addEventListener("resize", handleResize);
  container.addEventListener("click", onContainerClick);
  animate();

  return {
    toggleHeatmap: () => heatmap.toggle(),
    cleanup: () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("click", onContainerClick);
      heatmap.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    },
  };
}


// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// export function createScene(container, towers, routes) {

//   const scene = new THREE.Scene();
  
//   scene.background = new THREE.Color(0x101820);
   
//    const infoPanel =document.createElement("div");

//   infoPanel.style.position = "absolute";
//   infoPanel.style.top = "20px";
//   infoPanel.style.right = "20px";

//   infoPanel.style.background =
//     "rgba(0,0,0,0.8)";

//   infoPanel.style.color = "white";

//   infoPanel.style.padding = "15px";

//   infoPanel.style.borderRadius = "8px";

//   infoPanel.style.minWidth = "220px";

//   infoPanel.style.display = "none";

//   document.body.appendChild(
//     infoPanel
//   );

//   const raycaster =
//   new THREE.Raycaster();

//   const mouse =
//   new THREE.Vector2();

//   let selectedTruck = null;
 
//   // =========================
//   // CAMERA
//   // =========================

//   const camera = new THREE.PerspectiveCamera(
//     75,
//     container.clientWidth / container.clientHeight,
//     0.1,
//     5000
//   );

//   camera.position.set(
//   600,
//   500,
//   600
//   );

//   // =========================
//   // RENDERER
//   // =========================

//   const renderer = new THREE.WebGLRenderer({
//     antialias: true,
//   });

//   renderer.setSize(
//     container.clientWidth,
//     container.clientHeight
//   );

//   container.appendChild(renderer.domElement);

//   // =========================
//   // CONTROLS
//   // =========================

//   const controls = new OrbitControls(
//     camera,
//     renderer.domElement
//   );

//   controls.enableDamping = true;

//   controls.target.set(
//   500,
//   0,
//   500
//   );

//   controls.minDistance = 300;
//   controls.maxDistance = 2000;

//   controls.minPolarAngle = Math.PI / 4;
//   controls.maxPolarAngle = Math.PI / 2.3;

//   controls.update();

//   controls.maxPolarAngle =
//   Math.PI / 2.3;

// controls.minPolarAngle =
//   Math.PI / 4;

// // =========================
//   // GROUND
//   // =========================

//   const ground = new THREE.Mesh(
//     new THREE.PlaneGeometry(1000, 1000),
//     new THREE.MeshStandardMaterial({
//       color: 0x555555,
//     })
//   );

//   ground.rotation.x = -Math.PI / 2;
//   ground.position.set(500,0,500);
//   scene.add(ground);

//   // =========================
//   // GRID
//   // =========================

//   const grid = new THREE.GridHelper(
//     1000,
//     50
//   );

//   grid.position.set(500,0,500);

//   scene.add(grid);

//   // =========================
//   // LIGHTS
//   // =========================

//   const ambient = new THREE.AmbientLight(
//     0xffffff,
//     1
//   );

//   scene.add(ambient);

//   const directional = new THREE.DirectionalLight(
//     0xffffff,
//     3
//   );

//   directional.position.set(
//     200,
//     300,
//     200
//   );

//   scene.add(directional);

//   // =========================
//   // MINE LAYOUT
//   // =========================

//   const pitA = {
//     x: 250,
//     z: 250
//   };

//   const pitB = {
//     x: 750,
//     z: 250
//   };

//   const dumpSite = {
//     x: 500,
//     z: 750
//   };

//   const controlCenter = {
//     x: 500,
//     z: 100
//   };

//   function createZone(
//     x,
//     z,
//     color,
//     size
//   ) {
//     const zone = new THREE.Mesh(
//       new THREE.CylinderGeometry(
//         size,
//         size,
//         5,
//         32
//       ),
//       new THREE.MeshStandardMaterial({
//         color,
//       })
//     );

//     zone.position.set(
//       x,
//       2,
//       z
//     );

//     scene.add(zone);
//   }

//   createZone(
//     pitA.x,
//     pitA.z,
//     0x8B4513,
//     80
//   );

//   createZone(
//     pitB.x,
//     pitB.z,
//     0x8B4513,
//     80
//   );

//   createZone(
//     dumpSite.x,
//     dumpSite.z,
//     0x666666,
//     100
//   );

//   createZone(
//     controlCenter.x,
//     controlCenter.z,
//     0x0000ff,
//     60
//   );

//   // =========================
//   // ROADS
//   // =========================

//   function createRoad(
//     startX,
//     startZ,
//     endX,
//     endZ
//   ) {

//     const dx = endX - startX;
//     const dz = endZ - startZ;

//     const length = Math.sqrt(
//       dx * dx + dz * dz
//     );

//     const road = new THREE.Mesh(
//       new THREE.BoxGeometry(
//         length,
//         1,
//         20
//       ),
//       new THREE.MeshStandardMaterial({
//         color: 0x333333
//       })
//     );

//     road.position.set(
//       (startX + endX) / 2,
//       0.5,
//       (startZ + endZ) / 2
//     );

//     road.rotation.y =
//       Math.atan2(dz, dx);

//     scene.add(road);
//   }

//   createRoad(
//     pitA.x,
//     pitA.z,
//     dumpSite.x,
//     dumpSite.z
//   );

//   createRoad(
//     pitB.x,
//     pitB.z,
//     dumpSite.x,
//     dumpSite.z
//   );

//   createRoad(
//     controlCenter.x,
//     controlCenter.z,
//     dumpSite.x,
//     dumpSite.z
//   );


//   // =========================
//   // TOWERS
//   // =========================

//   towers.forEach((towerData) => {

//     const tower = new THREE.Mesh(
//       new THREE.CylinderGeometry(
//         5,
//         5,
//         100
//       ),
//       new THREE.MeshStandardMaterial({
//         color: 0x00ff00,
//       })
//     );

//     tower.position.set(
//       towerData.x,
//       50,
//       towerData.z
//     );

//     scene.add(tower);

//     const coverage = new THREE.Mesh(
//       new THREE.CircleGeometry(
//         towerData.coverageRadius,
//         64
//       ),
//       new THREE.MeshBasicMaterial({
//         color: 0x00ff00,
//         transparent: true,
//         opacity: 0.15,
//         side: THREE.DoubleSide,
//       })
//     );

//     coverage.rotation.x =
//       -Math.PI / 2;

//     coverage.position.set(
//       towerData.x,
//       0.2,
//       towerData.z
//     );

//     scene.add(coverage);

//   });

//   function createLabel(text) {

//   const canvas =
//     document.createElement("canvas");

//   const context =
//     canvas.getContext("2d");

//   canvas.width = 256;
//   canvas.height = 64;

//   context.fillStyle = "#00ffff";
//   context.font = "28px Arial";
//   context.fillText(text, 10, 40);

//   const texture =
//     new THREE.CanvasTexture(canvas);

//   const material =
//     new THREE.SpriteMaterial({
//       map: texture,
//       transparent: true
//     });

//   const sprite =
//     new THREE.Sprite(material);

//   sprite.scale.set(
//     60,
//     15,
//     1
//   );

//   return sprite;
// }

//   // =========================
//   // TRUCKS
//   // =========================

//   const truckObjects = [];

//   routes.forEach((route, index) => {

//     const truck = new THREE.Group();

//   // Body
//   const body = new THREE.Mesh(
//     new THREE.BoxGeometry(40, 15, 20),
//     new THREE.MeshStandardMaterial({
//       color: 0xffa500
//     })
//   );

//   body.position.y = 10;
//   truck.add(body);

//   // Cabin
//   const cabin = new THREE.Mesh(
//     new THREE.BoxGeometry(15, 12, 18),
//     new THREE.MeshStandardMaterial({
//       color: 0xffff00
//     })
//   );

//   cabin.position.set(-10, 20, 0);
//   truck.add(cabin);

//   // Wheels
//   for (let x of [-15, 15]) {
//     for (let z of [-12, 12]) {

//       const wheel = new THREE.Mesh(
//         new THREE.CylinderGeometry(
//           5,
//           5,
//           4,
//           16
//         ),
//         new THREE.MeshStandardMaterial({
//           color: 0x222222
//         })
//       );

//       wheel.rotation.z =
//         Math.PI / 2;

//       wheel.position.set(
//         x,
//         5,
//         z
//       );

//       truck.add(wheel);
//     }
//   }

//     const sourcePit =
//       index < routes.length / 2
//         ? pitA
//         : pitB;

//     truck.position.set(
//       sourcePit.x +
//       (Math.random() * 120 - 60),

//       10,

//       sourcePit.z +
//       (Math.random() * 120 - 60)
//     );

//     scene.add(truck);

//     truck.userData = {
//     type: "truck"
//     };

//     const label = createLabel(
//   `TRK${String(index + 1).padStart(3, "0")}`
//     );

// label.position.set(
//   0,
//   40,
//   0
// );

// truck.add(label);

//    truckObjects.push({
//   mesh: truck,

//   id: `TRK${String(index + 1).padStart(3, "0")}`,

//   speed: Math.floor(
//     25 + Math.random() * 20
//   ),

//   signal: Math.floor(
//     60 + Math.random() * 40
//   ),

//   fuel: Math.floor(
//     60 + Math.random() * 40
//   ),

//   battery: Math.floor(
//     70 + Math.random() * 30
//   ),

//   latency: Math.floor(
//     10 + Math.random() * 20
//   ),

//   start: sourcePit,
//   target: dumpSite,
//   progress: Math.random(),
//   returning: false
// });

//   });

//   function onMouseClick(event) {

//   mouse.x =
//     (event.clientX /
//       window.innerWidth) *
//       2 - 1;

//   mouse.y =
//     -(event.clientY /
//       window.innerHeight) *
//       2 + 1;

//   raycaster.setFromCamera(
//     mouse,
//     camera
//   );

//   const truckMeshes =
//     truckObjects.map(
//       truck => truck.mesh
//     );

//   const intersects =
//     raycaster.intersectObjects(
//       truckMeshes,
//       true
//     );

//   if (
//     intersects.length > 0
//   ) {

//     const clickedMesh =
//       intersects[0].object;

//     const clickedTruck =
//       truckObjects.find(
//         truck =>
//           truck.mesh === clickedMesh ||
//           truck.mesh.children.includes(
//             clickedMesh
//           )
//       );

//     if (clickedTruck) {

//        // Reset all trucks

//       truckObjects.forEach((truck) => {

//     truck.mesh.traverse((child) => {

//     if (child.isMesh) {

//       child.material.emissive =
//         new THREE.Color(0x000000);

//       child.material.emissiveIntensity = 0;

//         }

//        });

//       });

//       // Highlight selected truck

//       clickedTruck.mesh.traverse((child) => {

//       if (child.isMesh) {

//         child.material.emissive =
//           new THREE.Color(0xffff00);

//         child.material.emissiveIntensity = 0.8;

//       }

//      });

//       selectedTruck = clickedTruck;

//       infoPanel.style.display =
//         "block";

//       infoPanel.innerHTML = `
//         <h3>${clickedTruck.id}</h3>

//         Speed:
//         ${clickedTruck.speed} km/h
//         <br>

//         Signal:
//         ${clickedTruck.signal}%
//         <br>

//         Fuel:
//         ${clickedTruck.fuel}%
//         <br>

//         Battery:
//         ${clickedTruck.battery}%
//         <br>

//         Latency:
//         ${clickedTruck.latency} ms
//       `;
//     }
//   }
// }

//   // =========================
//   // ANIMATION
//   // =========================

//   function animate() {

//     requestAnimationFrame(
//       animate
//     );

//     truckObjects.forEach((truck) => {

//   truck.progress += 0.0015;

//   if (truck.progress >= 1) {

//     truck.progress = 0;

//     truck.returning =
//       !truck.returning;

//   }

//   let from;
//   let to;

//   if (!truck.returning) {

//     from = truck.start;
//     to = dumpSite;

//   } else {

//     from = dumpSite;
//     to = truck.start;

//   }

//   truck.mesh.position.x =
//     from.x +
//     (to.x - from.x) *
//     truck.progress;

//   truck.mesh.position.z =
//     from.z +
//     (to.z - from.z) *
//     truck.progress;

// });

//     controls.update();

//     renderer.render(
//       scene,
//       camera
//     );

//   }

//   window.addEventListener(
//   "click",
//   onMouseClick
//   );
//   animate();

//   const handleResize = () => {
//   if (!container) return;
//   const w = container.clientWidth;
//   const h = container.clientHeight;
//   camera.aspect = w / h;
//   camera.updateProjectionMatrix();
//   renderer.setSize(w, h);
// };
 
// window.addEventListener("resize", handleResize);

//   return {
//   scene,
//   camera,
//   renderer,
//   cleanup: () => {
//     window.removeEventListener("resize", handleResize);
//     window.removeEventListener("click", onMouseClick);
//     renderer.dispose();
//     container.removeChild(renderer.domElement);
//   },
// };

// }