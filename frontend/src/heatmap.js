import * as THREE from "three";

/**
 * Creates a canvas-based signal heatmap texture overlaid on the ground plane.
 * Re-call updateHeatmap() whenever truck positions change.
 */
export function createHeatmapOverlay(scene, worldSize = 1000, worldCenter = { x: 500, z: 500 }) {
  const RES = 256; // canvas resolution

  const canvas = document.createElement("canvas");
  canvas.width = RES;
  canvas.height = RES;
  const ctx = canvas.getContext("2d");

  const texture = new THREE.CanvasTexture(canvas);

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(worldSize, worldSize),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(worldCenter.x, 1.5, worldCenter.z);
  mesh.visible = false; // starts hidden
  scene.add(mesh);

  /**
   * Re-draws the heatmap based on current truck positions + signal values.
   * @param {Array} trucks - array of { mesh: THREE.Group, signal: number }
   */
  function update(trucks) {
    ctx.clearRect(0, 0, RES, RES);

    // Dark base
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillRect(0, 0, RES, RES);

    if (!isFinite(worldSize) || worldSize <= 0) {
      console.warn("Invalid worldSize in heatmap:", worldSize);
      return;
    }

    trucks.forEach(truck => {
      if (!truck.mesh) return;
      const wx = truck.mesh.position.x;
      const wz = truck.mesh.position.z;

      if (!isFinite(wx) || !isFinite(wz)) {
        return;
      }

      // World → canvas coords
      const cx = ((wx - (worldCenter.x - worldSize / 2)) / worldSize) * RES;
      const cy = ((wz - (worldCenter.z - worldSize / 2)) / worldSize) * RES;

      const sig = truck.signal ?? 50;
      const radius = 18 + (sig / 100) * 14; // bigger blob = better signal

      if (!isFinite(cx) || !isFinite(cy) || !isFinite(radius) || radius <= 0) {
        return;
      }

      // Color: green (high signal) → amber → red (low signal)
      let r, g, b;
      if (sig >= 80) { r=0;   g=220; b=130; }
      else if (sig >= 55) { r=245; g=166; b=35; }
      else { r=255; g=69;  b=96; }

      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0,   `rgba(${r},${g},${b},0.75)`);
      gradient.addColorStop(0.5, `rgba(${r},${g},${b},0.30)`);
      gradient.addColorStop(1,   `rgba(${r},${g},${b},0)`);

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    });

    texture.needsUpdate = true;
  }

  function show() { mesh.visible = true; }
  function hide() { mesh.visible = false; }
  function toggle() { mesh.visible = !mesh.visible; return mesh.visible; }
  function isVisible() { return mesh.visible; }
  function dispose() { scene.remove(mesh); texture.dispose(); mesh.geometry.dispose(); mesh.material.dispose(); }

  return { update, show, hide, toggle, isVisible, dispose };
}
