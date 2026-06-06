import * as THREE from "three";
import {
  NODES,
  EDGES,
  LOAD_ZONES,
  DUMP_ZONES,
  FUEL_ZONES,
  HUB_NODES
} from "./mapData";
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
  ground.position.set(0, 0, 0);
  scene.add(ground);

  const grid = new THREE.GridHelper(1000, 50, 0x004455, 0x002233);
  grid.position.set(500, 0.5, 500);
  // scene.add(grid);

  // =========================
  // HEATMAP OVERLAY
  // =========================
  const heatmap = createHeatmapOverlay(
  scene,
  1400,
  { x: 0, z: 0 }
  );

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

  createRoadNetwork(scene); //calling roadnetwork
  createNodes(scene);

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
/**fake roads commented out */
  // createRoad(pitA.x, pitA.z, dumpSite.x, dumpSite.z);
  // createRoad(pitB.x, pitB.z, dumpSite.x, dumpSite.z);
  // createRoad(controlCenter.x, controlCenter.z, dumpSite.x, dumpSite.z);

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


  function createRoadNetwork(scene) {

  EDGES.forEach(([a, b]) => {

    const start = NODES[a];
    const end = NODES[b];

    if (!start || !end) return;

    const points = [
      new THREE.Vector3(
        start.x,
        1,
        start.z
      ),

      new THREE.Vector3(
        end.x,
        1,
        end.z
      )
    ];

    const geometry =
      new THREE.BufferGeometry()
        .setFromPoints(points);

    const line =
      new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
          color: 0x00ffff
        })
      );

    scene.add(line);

  });

  }

  function createNodes(scene) {

  Object.values(NODES).forEach((node) => {

    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 8, 8),
      new THREE.MeshBasicMaterial({
        color: 0xffffff
      })
    );

    dot.position.set(
      node.x,
      2,
      node.z
    );

    scene.add(dot);

  });

  }
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
    console.log(route);
    console.log(route.loadZone);
    console.log(NODES[route.loadZone]);


    console.log("Route:", route);
    console.log("LoadZone:", route.loadZone);

    if (!route.points || route.points.length === 0) {
      console.error("No points for route", route);
      return;
    }

    const firstPoint = route.points[0];

    console.log("First Point:", firstPoint);

    truck.position.set(
      firstPoint.x,
      8,
      firstPoint.y
    );

    truck.userData.type = "truck";

    const label = createLabel(`TRK${String(index + 1).padStart(3, "0")}`);
    label.position.set(0, 38, 0);
    truck.add(label);
    scene.add(truck);

    truckObjects.push({
      mesh: truck,
      id: route.truckId || `TRK${index + 1}`,
      routePoints: route.points,
      pointIndex: 0,

      speed: Math.floor(25 + Math.random() * 20),
      signal: Math.floor(60 + Math.random() * 40),
      fuel: Math.floor(60 + Math.random() * 40),
      battery: Math.floor(70 + Math.random() * 30),
      latency: Math.floor(10 + Math.random() * 20),
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

      const pts = truck.routePoints;

      if (!pts || pts.length === 0) return;

      truck.pointIndex =
        (truck.pointIndex + 1) % pts.length;

      const p = pts[truck.pointIndex];

      truck.mesh.position.set(
        p.x,
        8,
        p.y
      );

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