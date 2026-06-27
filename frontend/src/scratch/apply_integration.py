import os

file_path = r"c:\Users\DAIICT B\Documents\202512081\mine-digital-twin\frontend\src\MineScene.js"

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

# 1. Declare roadsGroup
code = code.replace(
    '  // const grid = new THREE.GridHelper(Math.max(GW, GH), 100, C.gridMajor, C.gridMinor);\n  // grid.position.y = -1.5;\n  // scene.add(grid);',
    '  // const grid = new THREE.GridHelper(Math.max(GW, GH), 100, C.gridMajor, C.gridMinor);\n  // grid.position.y = -1.5;\n  // scene.add(grid);\n\n  const roadsGroup = new THREE.Group();\n  scene.add(roadsGroup);'
)

# 2. Update scaling factors in createRoadGeometry
code = code.replace(
    'let vy = getZ(vx + OX, vz + OY) * 0.04 + heightOffset;',
    'let vy = getZ(vx + OX, vz + OY) * 0.4 + heightOffset;'
)
code = code.replace(
    'let vy_l = getZ(vx_l + OX, vz_l + OY) * 0.04 + heightOffset;',
    'let vy_l = getZ(vx_l + OX, vz_l + OY) * 0.4 + heightOffset;'
)
code = code.replace(
    'let vy_r = getZ(vx_r + OX, vz_r + OY) * 0.04 + heightOffset;',
    'let vy_r = getZ(vx_r + OX, vz_r + OY) * 0.4 + heightOffset;'
)
code = code.replace(
    'const wy = getZ(wx + OX, wz + OY) * 0.04 + 0.02; // shoulder height',
    'const wy = getZ(wx + OX, wz + OY) * 0.4 + 0.02; // shoulder height'
)
code = code.replace(
    'const wy = getZ(rx, ry) * 0.04;',
    'const wy = getZ(rx, ry) * 0.4;'
)

# 3. Insert createSmoothRoadGeometry helper below createRoadGeometry return
target_geom_end = """    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.setIndex(indices);
    geom.computeVertexNormals();

    return geom;
  }"""

replacement_geom_end = target_geom_end + """

  function createSmoothRoadGeometry(pts, width, heightOffset = 0, isPavement = false) {
    if (pts.length < 2) return null;
    const geom = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];
    const uvs = [];

    const segments = pts.length - 1;
    const widthSegments = isPavement ? 6 : 2;

    let accumulatedLength = 0;
    const segmentLengths = [];
    for (let i = 0; i < segments; i++) {
      const l = pts[i].distanceTo(pts[i+1]);
      segmentLengths.push(l);
      accumulatedLength += l;
    }

    let currentU = 0;
    for (let i = 0; i <= segments; i++) {
      const p = pts[i];
      const prevP = pts[Math.max(0, i - 1)];
      const nextP = pts[Math.min(segments, i + 1)];

      const dir = new THREE.Vector3().subVectors(nextP, prevP);
      dir.y = 0;
      if (dir.lengthSq() < 1e-9) dir.set(0, 0, 1);
      dir.normalize();

      const perpX = -dir.z;
      const perpZ = dir.x;

      for (let j = 0; j <= widthSegments; j++) {
        const t_w = j / widthSegments;
        const offsetFactor = t_w - 0.5;

        const vx = p.x + perpX * (width * offsetFactor);
        const vz = p.z + perpZ * (width * offsetFactor);
        let vy = p.y + heightOffset;

        if (isPavement) {
          const dist = Math.abs(width * offsetFactor);
          const noiseVal = fbm(vx * 0.08, vz * 0.08, 3) * 0.35;
          const rutCenter = 3.0;
          const rutWidth = 1.6;
          const distToRut = Math.abs(dist - rutCenter);
          let rutVal = 0;
          if (distToRut < rutWidth) {
            rutVal = -0.2 * (1.0 + Math.cos(distToRut * Math.PI / rutWidth));
          }
          vy += noiseVal + rutVal;
        } else {
          const noiseVal = fbm(vx * 0.08, vz * 0.08, 3) * 0.2;
          vy += noiseVal;
        }

        vertices.push(vx, vy, vz);
        uvs.push(currentU, t_w);
      }
      if (i < segments) {
        currentU += segmentLengths[i];
      }
    }

    const rowSize = widthSegments + 1;
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < widthSegments; j++) {
        const v0 = i * rowSize + j;
        const v1 = i * rowSize + (j + 1);
        const v2 = (i + 1) * rowSize + j;
        const v3 = (i + 1) * rowSize + (j + 1);

        indices.push(v0, v1, v2);
        indices.push(v1, v3, v2);
      }
    }

    const N_top = (segments + 1) * (widthSegments + 1);
    const thickness = isPavement ? 1.2 : 0.8;
    currentU = 0;
    for (let i = 0; i <= segments; i++) {
      const p = pts[i];
      const prevP = pts[Math.max(0, i - 1)];
      const nextP = pts[Math.min(segments, i + 1)];

      const dir = new THREE.Vector3().subVectors(nextP, prevP);
      dir.y = 0;
      if (dir.lengthSq() < 1e-9) dir.set(0, 0, 1);
      dir.normalize();

      const perpX = -dir.z;
      const perpZ = dir.x;

      const vx_l = p.x + perpX * (width * -0.5);
      const vz_l = p.z + perpZ * (width * -0.5);
      let vy_l = p.y + heightOffset;
      vy_l += fbm(vx_l * 0.08, vz_l * 0.08, 3) * 0.2;
      vertices.push(vx_l, vy_l - thickness, vz_l);
      uvs.push(currentU, 0);

      const vx_r = p.x + perpX * (width * 0.5);
      const vz_r = p.z + perpZ * (width * 0.5);
      let vy_r = p.y + heightOffset;
      vy_r += fbm(vx_r * 0.08, vz_r * 0.08, 3) * 0.2;
      vertices.push(vx_r, vy_r - thickness, vz_r);
      uvs.push(currentU, 1);

      if (i < segments) {
        currentU += segmentLengths[i];
      }
    }

    for (let i = 0; i < segments; i++) {
      const tl_cur = i * rowSize;
      const tl_nxt = (i + 1) * rowSize;
      const bl_cur = N_top + i * 2;
      const bl_nxt = N_top + (i + 1) * 2;

      indices.push(tl_cur, tl_nxt, bl_cur);
      indices.push(tl_nxt, bl_nxt, bl_cur);

      const tr_cur = i * rowSize + widthSegments;
      const tr_nxt = (i + 1) * rowSize + widthSegments;
      const br_cur = N_top + i * 2 + 1;
      const br_nxt = N_top + (i + 1) * 2 + 1;

      indices.push(tr_cur, br_cur, tr_nxt);
      indices.push(tr_nxt, br_cur, br_nxt);
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }"""

code = code.replace(target_geom_end, replacement_geom_end)

# 4. Remove pit outlining loop (by replacement)
pit_outlines_pattern = """  for (const nodeNames of Object.values(pitGroups)) {
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
        map: texRock,
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
        const dx = p2_top.x - p1_top.x;
        const dz = p2_top.z - p1_top.z;
        const len = Math.hypot(dx, dz);
        const texScale = 0.04;
        const u0 = 0, u1 = len * texScale;
        const v0 = yTop * texScale, v1 = yBot * texScale;
        const uvs = new Float32Array([
          u0, v0,
          u1, v0,
          u1, v1,
          u0, v1,
        ]);
        
        const wallGeo = new THREE.BufferGeometry();
        wallGeo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
        wallGeo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        wallGeo.setIndex([0, 1, 2, 0, 2, 3]);
        wallGeo.computeVertexNormals();
        const wallMesh = new THREE.Mesh(wallGeo, wallMat);
        wallMesh.receiveShadow = true;
        wallMesh.castShadow = true;
        scene.add(wallMesh);
        teleportTargets.push(wallMesh);
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
    
    // Scale UVs for bottom geometry
    const uvs = bottomGeo.attributes.uv;
    for (let i = 0; i < uvs.count; i++) {
      uvs.setXY(i, uvs.getX(i) * 0.02, uvs.getY(i) * 0.02);
    }
    
    const bottomMesh = new THREE.Mesh(bottomGeo, new THREE.MeshStandardMaterial({
      map: texRock,
      color: 0x3a2a1a, emissive: 0x0a0804, emissiveIntensity: 0.1,
      roughness: 1.0, metalness: 0.0, side: THREE.DoubleSide
    }));
    bottomMesh.rotation.x = -Math.PI / 2;
    bottomMesh.position.y = -(totalDepth) - 0.5;
    bottomMesh.receiveShadow = true;
    scene.add(bottomMesh);
    teleportTargets.push(bottomMesh);

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
  }"""

code = code.replace(pit_outlines_pattern, "  // Pits outlines removed to display paths only")

# 5. Replace static roads generation loop
old_roads_loop = """  for (const [a, b] of EDGES) {
    const na = NODES[a], nb = NODES[b];
    if (!na || !nb) continue;

    const dx = nb.x - na.x;
    const dz = nb.z - na.z;
    const lenHorizontal = Math.hypot(dx, dz);
    if (lenHorizontal < 0.5) continue;

    // Generate terrain-conforming 3D curves for asset clamping
    const curvePoints = [];
    const segments = Math.max(8, Math.floor(lenHorizontal / 10));
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const wx = na.x + dx * t;
      const wz = na.z + dz * t;
      const rx = wx + OX;
      const ry = wz + OY;
      const wy = getZ(rx, ry) * 0.4;
      curvePoints.push(new THREE.Vector3(wx, wy + 0.06, wz)); // 0.06 is pavement elevation offset
    }
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    roadCurves.set(`${a}_${b}`, curve);
    const curvePointsReversed = [...curvePoints].reverse();
    roadCurves.set(`${b}_${a}`, new THREE.CatmullRomCurve3(curvePointsReversed));

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

    /* ─── Layer 5: Pit road extras — bollards + chevrons ─── */
    if (isPitRd || isHaul) {
      const bermH = 3.0, bermW = 2.5;
      const bermOffset = paveW / 2 + 1.2;
      for (const side of [-1, 1]) {
        const bermGeom = createBermGeometry(na, nb, bermOffset * side, bermH, bermW);
        const bermMesh = new THREE.Mesh(bermGeom, isPitRd ? matGravelPit : matGravel);
        bermMesh.castShadow = true;
        scene.add(bermMesh);
      }

      if (isPitRd) {
        const step = Math.max(15, Math.floor(lenHorizontal / 3.2));
        for (let i = 2; i < step - 2; i++) {
          const t = i / step;
          const pos = curve.getPointAt(t);
          const tangent = curve.getTangentAt(t).normalize();
          const roadNormal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
          const barrierPos = pos.clone().add(roadNormal.clone().multiplyScalar(bermOffset));
          
          if (i % 3 === 0) {
            const postBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3.5, 8), matBollardWhite);
            postBottom.position.set(barrierPos.x, barrierPos.y + 1.75, barrierPos.z);
            scene.add(postBottom);

            const postTop = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.2, 8), matBollardRed);
            postTop.position.set(barrierPos.x, barrierPos.y + 3.5 + 0.6, barrierPos.z);
            scene.add(postTop);
          }
        }
      }

      if (isPitRd && lenHorizontal > 60) {
        const t = 0.5;
        const pos = curve.getPointAt(t);
        const tangent = curve.getTangentAt(t).normalize();
        const roadNormal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
        const downhill = (nb.y < na.y) ? 1 : -1;

        const signDist = bermOffset + 3.0;
        const signPos = pos.clone().add(roadNormal.clone().multiplyScalar(signDist));

        const postGeo = new THREE.CylinderGeometry(0.3, 0.3, 14, 8);
        const post = new THREE.Mesh(postGeo, matGuardrail);
        post.position.set(signPos.x, signPos.y + 7, signPos.z);
        scene.add(post);

        const signSize = 8.5;
        const chevShape = new THREE.Shape();
        chevShape.moveTo(-signSize/2, -signSize/2);
        chevShape.lineTo(signSize/2, -signSize/2);
        chevShape.lineTo(signSize/2, signSize/2);
        chevShape.lineTo(-signSize/2, signSize/2);
        chevShape.closePath();

        const innerHole = new THREE.Path();
        const w = 2.5;
        innerHole.moveTo(-w, -signSize/2);
        innerHole.lineTo(w, 0);
        innerHole.lineTo(-w, signSize/2);
        innerHole.lineTo(-w - 1.8, signSize/2);
        innerHole.lineTo(w - 1.8, 0);
        innerHole.lineTo(-w - 1.8, -signSize/2);
        innerHole.closePath();
        chevShape.holes.push(innerHole);

        const chevShape2 = new THREE.Shape();
        chevShape2.moveTo(w, -signSize/2);
        chevShape2.lineTo(w + 1.8, -signSize/2);
        chevShape2.lineTo(w + 1.8 + 1.8, 0);
        chevShape2.lineTo(w + 1.8, signSize/2);
        chevShape2.lineTo(w, signSize/2);
        chevShape2.lineTo(w + 1.8, 0);
        chevShape2.closePath();

        const chevShape3 = new THREE.Shape();
        chevShape3.moveTo(-w - 1.8, -signSize/2);
        chevShape3.lineTo(-w, -signSize/2);
        chevShape3.lineTo(-w + 1.8, 0);
        chevShape3.lineTo(-w, signSize/2);
        chevShape3.lineTo(-w - 1.8, signSize/2);
        chevShape3.lineTo(-w, 0);
        chevShape3.closePath();

        const chevGeo = new THREE.ShapeGeometry([chevShape, chevShape2, chevShape3]);
        const chev = new THREE.Mesh(chevGeo, matChevron);
        chev.rotation.x = -Math.PI / 2;

        const flatDir = new THREE.Vector3(tangent.x * downhill, 0, tangent.z * downhill).normalize();
        const angle = Math.atan2(flatDir.x, flatDir.z);
        chev.rotation.z = -angle;
        chev.position.set(signPos.x, signPos.y + 11.5, signPos.z);
        scene.add(chev);

        for (let side = -1; side <= 1; side += 2) {
          const startPt = pos.clone().add(tangent.clone().multiplyScalar(side * 8));
          const barrierPos = startPt.add(roadNormal.clone().multiplyScalar(bermOffset - 0.5));
          const shield = alignedMesh(
            barrierPos.x - tangent.x * 3.5, barrierPos.y + 1.8, barrierPos.z - tangent.z * 3.5,
            barrierPos.x + tangent.x * 3.5, barrierPos.y + 1.8, barrierPos.z + tangent.z * 3.5,
            8, 1.4, 0.4, matGuardrail
          );
          scene.add(shield);

          const postLeft = new THREE.Mesh(postGeo, matGuardrail);
          postLeft.position.set(barrierPos.x - tangent.x * 3.5, barrierPos.y + 2, barrierPos.z - tangent.z * 3.5);
          scene.add(postLeft);

          const postRight = new THREE.Mesh(postGeo, matGuardrail);
          postRight.position.set(barrierPos.x + tangent.x * 3.5, barrierPos.y + 2, barrierPos.z + tangent.z * 3.5);
          scene.add(postRight);

          const chevShape = new THREE.Shape();
          chevShape.moveTo(-2, -1.5);
          chevShape.lineTo(2, -1.5);
          chevShape.lineTo(2, 1.5);
          chevShape.lineTo(-2, 1.5);
          chevShape.closePath();

          const innerHole = new THREE.Path();
          innerHole.moveTo(-0.6, -1.5);
          innerHole.lineTo(0.6, 0);
          innerHole.lineTo(-0.6, 1.5);
          innerHole.lineTo(-1.2, 1.5);
          innerHole.lineTo(0, 0);
          innerHole.lineTo(-1.2, -1.5);
          innerHole.closePath();
          chevShape.holes.push(innerHole);

          const chevShape2 = new THREE.Shape();
          chevShape2.moveTo(0.6, -1.5);
          chevShape2.lineTo(1.2, -1.5);
          chevShape2.lineTo(1.8, 0);
          chevShape2.lineTo(1.2, 1.5);
          chevShape2.lineTo(0.6, 1.5);
          chevShape2.lineTo(1.2, 0);
          chevShape2.closePath();

          const chevShape3 = new THREE.Shape();
          chevShape3.moveTo(-1.8, -1.5);
          chevShape3.lineTo(-1.2, -1.5);
          chevShape3.lineTo(-0.6, 0);
          chevShape3.lineTo(-1.2, 1.5);
          chevShape3.lineTo(-1.8, 1.5);
          chevShape3.lineTo(-1.2, 0);
          chevShape3.closePath();

          const chevGeo = new THREE.ShapeGeometry([chevShape, chevShape2, chevShape3]);
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
  }"""

new_roads_loop = """  function rebuildLocalRoads() {
    while (roadsGroup.children.length > 0) {
      const child = roadsGroup.children[0];
      if (child.geometry) child.geometry.dispose();
      roadsGroup.remove(child);
    }

    for (const [a, b] of EDGES) {
      const na = NODES[a], nb = NODES[b];
      if (!na || !nb) continue;

      const dx = nb.x - na.x;
      const dz = nb.z - na.z;
      const lenHorizontal = Math.hypot(dx, dz);
      if (lenHorizontal < 0.5) continue;

      const isHaul  = mainHaulSet.has(a) || mainHaulSet.has(b);
      const isPitRd = PIT_ROAD_NODES.has(a) && PIT_ROAD_NODES.has(b);

      const paveW    = isHaul ? 20 : (isPitRd ? 14 : 12);
      const shouldW  = paveW + 8;

      const shoulderGeom = createRoadGeometry(na, nb, shouldW, 0.02, false);
      const shoulderMesh = new THREE.Mesh(shoulderGeom, isPitRd ? matGravelPit : matGravel);
      shoulderMesh.receiveShadow = true;
      roadsGroup.add(shoulderMesh);
      teleportTargets.push(shoulderMesh);

      const ratio = Math.max(1, Math.min(8, Math.round(lenHorizontal / paveW)));
      const paveMat = isPitRd ? matAsphaltPitPool[ratio - 1] : (isHaul ? matAsphaltHaulPool[ratio - 1] : matAsphaltPool[ratio - 1]);
      const paveGeom = createRoadGeometry(na, nb, paveW, 0.06, true);
      const pavementMesh = new THREE.Mesh(paveGeom, paveMat);
      pavementMesh.castShadow = true;
      pavementMesh.receiveShadow = true;
      roadsGroup.add(pavementMesh);
      teleportTargets.push(pavementMesh);

      const edgeOffset = paveW / 2 - 0.5;
      const lineW = 0.6;

      const leftLineGeom = createRoadGeometry(na, nb, lineW, 0.08, false);
      const leftPos = leftLineGeom.attributes.position;
      const perpX = -dz / lenHorizontal, perpZ = dx / lenHorizontal;
      for (let i = 0; i < leftPos.count; i++) {
        leftPos.setX(i, leftPos.getX(i) - perpX * edgeOffset);
        leftPos.setZ(i, leftPos.getZ(i) - perpZ * edgeOffset);
      }
      leftLineGeom.computeVertexNormals();
      const leftLineMesh = new THREE.Mesh(leftLineGeom, isPitRd ? matCentrePit : matEdgeLine);
      roadsGroup.add(leftLineMesh);

      const rightLineGeom = createRoadGeometry(na, nb, lineW, 0.08, false);
      const rightPos = rightLineGeom.attributes.position;
      for (let i = 0; i < rightPos.count; i++) {
        rightPos.setX(i, rightPos.getX(i) + perpX * edgeOffset);
        rightPos.setZ(i, rightPos.getZ(i) + perpZ * edgeOffset);
      }
      rightLineGeom.computeVertexNormals();
      const rightLineMesh = new THREE.Mesh(rightLineGeom, isPitRd ? matCentrePit : matEdgeLine);
      roadsGroup.add(rightLineMesh);

      if (!isHaul) {
        const centerLineW = isPitRd ? 1.2 : 0.7;
        const centerLineGeom = createRoadGeometry(na, nb, centerLineW, 0.08, false);
        const centerLineMesh = new THREE.Mesh(centerLineGeom, isPitRd ? matCentrePit : matCentreWhite);
        roadsGroup.add(centerLineMesh);
      } else {
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
          roadsGroup.add(dashMesh);
        }
      }

      if (isPitRd || isHaul) {
        const bermH = 3.0, bermW = 2.5;
        const bermOffset = paveW / 2 + 1.2;
        for (const side of [-1, 1]) {
          const bermGeom = createBermGeometry(na, nb, bermOffset * side, bermH, bermW);
          const bermMesh = new THREE.Mesh(bermGeom, isPitRd ? matGravelPit : matGravel);
          bermMesh.castShadow = true;
          roadsGroup.add(bermMesh);
        }
      }
    }
  }

  function rebuildSmoothRoads(roadsData) {
    while (roadsGroup.children.length > 0) {
      const child = roadsGroup.children[0];
      if (child.geometry) child.geometry.dispose();
      roadsGroup.remove(child);
    }

    roadsData.forEach(poly => {
      const pts = poly.map(pt => simToWorld(pt[0], pt[1], pt[2]));
      if (pts.length < 2) return;

      const paveW = 14;
      const shouldW = paveW + 8;

      const shoulderGeom = createSmoothRoadGeometry(pts, shouldW, 0.02, false);
      if (shoulderGeom) {
        const shoulderMesh = new THREE.Mesh(shoulderGeom, matGravel);
        shoulderMesh.receiveShadow = true;
        roadsGroup.add(shoulderMesh);
        teleportTargets.push(shoulderMesh);
      }

      const paveGeom = createSmoothRoadGeometry(pts, paveW, 0.06, true);
      if (paveGeom) {
        const ratio = Math.max(1, Math.min(8, Math.round(pts.length * 10 / paveW)));
        const paveMat = matAsphaltPool[ratio - 1] || matAsphaltPool[0];
        const pavementMesh = new THREE.Mesh(paveGeom, paveMat);
        pavementMesh.castShadow = true;
        pavementMesh.receiveShadow = true;
        roadsGroup.add(pavementMesh);
        teleportTargets.push(pavementMesh);
      }

      const centerLineW = 0.7;
      const centerLineGeom = createSmoothRoadGeometry(pts, centerLineW, 0.08, false);
      if (centerLineGeom) {
        const centerLineMesh = new THREE.Mesh(centerLineGeom, matCentreWhite);
        roadsGroup.add(centerLineMesh);
      }
    });
  }

  // Draw initial local fallback roads
  rebuildLocalRoads();"""

code = code.replace(old_roads_loop, new_roads_loop)

# 6. Replace truck/tower spawning logic
old_spawn = """  truckRoutes.forEach((route, i) => {
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

  /* ──══════════════════════════════════════════════
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
  });"""

new_spawn = """  function makeTowerMesh(index, currentPos, id) {
    const towerGrp = new THREE.Group();
    towerGrp.position.copy(currentPos);
    
    const legGeo = new THREE.CylinderGeometry(0.8, 1.5, 85, 4);
    const legMat = stdMat({ color: C.towerMast, emissive: C.towerMast, emissiveIntensity: 0.1, roughness: 0.7, metalness: 0.8 });
    
    for (const [x, z] of [[-3,-3], [3,-3], [3,3], [-3,3]]) {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, 42.5, z);
      leg.rotation.x = -z * 0.02;
      leg.rotation.z = x * 0.02;
      leg.castShadow = true;
      towerGrp.add(leg);
    }
    
    for (let h = 10; h <= 70; h += 15) {
      const braceSize = 6 - (h / 85) * 3;
      const braceGeo = new THREE.BoxGeometry(braceSize * 2, 0.5, braceSize * 2);
      const brace = new THREE.Mesh(braceGeo, legMat);
      brace.position.y = h;
      towerGrp.add(brace);
    }
    
    const platform = new THREE.Mesh(
      new THREE.BoxGeometry(10, 1.5, 10),
      stdMat({ color: 0x334455, roughness: 0.8, metalness: 0.9 })
    );
    platform.position.y = 85;
    towerGrp.add(platform);
    
    for (const rot of [0, Math.PI]) {
      const dish = new THREE.Mesh(
        new THREE.SphereGeometry(2.5, 12, 12, 0, Math.PI),
        stdMat({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.4 })
      );
      dish.position.set(rot === 0 ? 5 : -5, 87, 0);
      dish.rotation.y = rot;
      dish.rotation.x = Math.PI / 8;
      towerGrp.add(dish);
    }
 
    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 10),
      legMat
    );
    rod.position.y = 90;
    towerGrp.add(rod);
 
    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(3, 14, 14),
      new THREE.MeshBasicMaterial({ color: C.beacon })
    );
    beacon.position.y = 95;
    beacon.userData.pulse = true;
    beacon.userData.pulseOffset = index * 0.5;
    towerGrp.add(beacon);
 
    const bLight = new THREE.PointLight(C.beacon, 4, 150);
    bLight.position.copy(beacon.position);
    towerGrp.add(bLight);
    
    return { towerGrp, beacon, bLight };
  }

  const COV_SCALE = 0.45;
  const towerObjects = [];

  function spawnTruckObject(id, x, y, z) {
    const mesh = makeTruck(id);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    
    const tObj = {
      mesh, id,
      speed: 0,
      signal: 100,
      fuel: 100,
      battery: 100,
      latency: 15,
      op_state: "idle",
      mass_kg: 0,
      loaded: false
    };
    truckObjects.push(tObj);
    return tObj;
  }

  function removeTruckObject(id) {
    const idx = truckObjects.findIndex(t => t.id === id);
    if (idx !== -1) {
      scene.remove(truckObjects[idx].mesh);
      truckObjects.splice(idx, 1);
    }
  }

  function spawnTowerObject(id, x, y, z, commRadius = 250, battery = 80, active = true, color = [230, 60, 60], index = 0) {
    const currentPos = new THREE.Vector3(x, y, z);
    const { towerGrp, beacon, bLight } = makeTowerMesh(index, currentPos, id);
    scene.add(towerGrp);

    const covR = commRadius * COV_SCALE;

    const sphereGeo = new THREE.IcosahedronGeometry(covR, 2);
    const coverageSphere = new THREE.Mesh(
      sphereGeo,
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(color[0]/255, color[1]/255, color[2]/255),
        transparent: true, opacity: 0.04, depthWrite: false
      })
    );
    coverageSphere.position.set(currentPos.x, currentPos.y + 95, currentPos.z);
    coverageSphere.visible = active;
    scene.add(coverageSphere);

    const coverageWire = new THREE.Mesh(
      sphereGeo,
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(color[0]/255, color[1]/255, color[2]/255),
        transparent: true, opacity: 0.15, wireframe: true, depthWrite: false
      })
    );
    coverageWire.position.copy(coverageSphere.position);
    coverageWire.visible = active;
    scene.add(coverageWire);

    const tLbl = makeLabel(id, {
      bgColor: "#0a2a1a", textColor: "#00ffaa",
      fontSize: 15, width: 160, height: 44
    });
    tLbl.position.set(currentPos.x, currentPos.y + 102, currentPos.z);
    scene.add(tLbl);

    const tObj = {
      id, currentPos, towerGrp, beacon, bLight,
      coverageSphere, coverageWire, tLbl,
      coverageRadius: covR,
      initialDbRadius: commRadius,
      battery, active, color
    };
    towerObjects.push(tObj);
    return tObj;
  }

  function removeTowerObject(id) {
    const idx = towerObjects.findIndex(t => t.id === id);
    if (idx !== -1) {
      const t = towerObjects[idx];
      scene.remove(t.towerGrp);
      scene.remove(t.coverageSphere);
      scene.remove(t.coverageWire);
      scene.remove(t.tLbl);
      towerObjects.splice(idx, 1);
    }
  }

  function clearEntities() {
    truckObjects.forEach(t => scene.remove(t.mesh));
    truckObjects.length = 0;

    towerObjects.forEach(t => {
      scene.remove(t.towerGrp);
      scene.remove(t.coverageSphere);
      scene.remove(t.coverageWire);
      scene.remove(t.tLbl);
    });
    towerObjects.length = 0;
  }

  // Pre-calculate fallback allocations
  let centroids = [];
  const step = Math.max(1, Math.floor(truckRoutes.length / 4));
  for (let k = 0; k < 4; k++) {
    const rIdx = Math.min(k * step, truckRoutes.length - 1);
    const tk = truckRoutes[rIdx];
    const n = NODES[tk.loadZone];
    if (n) centroids.push({ x: n.x, z: n.z });
  }
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

  function initFallbackSimulation() {
    clearEntities();
    
    truckRoutes.forEach((route, i) => {
      const startNode = NODES[route.loadZone];
      if (!startNode) return;
      
      const t = spawnTruckObject(route.id, startNode.x, startNode.y + 9, startNode.z);
      t.path = findPath(route.loadZone, route.dumpZone) ?? [route.loadZone, route.dumpZone];
      t.returnPath = [...t.path].reverse();
      t.currentPath = t.path;
      t.segIdx = Math.floor(Math.random() * Math.max(1, t.path.length - 1));
      t.progress = Math.random();
      t.returning = Math.random() > 0.5;
      t.speed = 25 + Math.floor(Math.random() * 20);
    });

    (apiTowers ?? []).forEach((td, i) => {
      const startNodeName = startNodeNames[i % startNodeNames.length];
      const pos = NODES[startNodeName];
      const towerId = td._id ?? `TWR${String(i+1).padStart(3,"0")}`;
      
      const tw = spawnTowerObject(
        towerId, pos.x, pos.y, pos.z,
        td.coverageRadius ?? 200,
        80 + Math.random() * 20,
        true, [230, 60, 60], i
      );
      tw.currentNodeName = startNodeName;
      tw.nextNodeName = startNodeName;
      tw.homeNodeName = startNodeName;
      tw.path = [];
      tw.progress = 1.0;
    });
  }

  let useFallbackSim = true;
  initFallbackSimulation();"""

code = code.replace(old_spawn, new_spawn)

# 7. Replace WebSocket connection and LERP playback loop
old_ws_block = """  const WS_URL = `ws://${window.location.hostname || "localhost"}:8765`;
  let ws = null;
  let wsConnected = false;
  let wsBuffer = [];
  let renderClock = null;

  function connectWS() {
    ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      console.log("[ws] Connected to spatial server");
      wsConnected = true;
      if (useFallbackSim) {
        useFallbackSim = false;
        clearEntities();
      }
    };
    ws.onclose = () => {
      console.warn("[ws] Disconnected from spatial server, falling back to mock simulation");
      wsConnected = false;
      ws = null;
      renderClock = null;
      wsBuffer = [];
      if (!useFallbackSim) {
        useFallbackSim = true;
        initFallbackSimulation();
      }
      setTimeout(connectWS, 3000);
    };
    ws.onerror = (err) => {
      wsConnected = false;
    };
    ws.onmessage = (ev) => {
      let m;
      try {
        m = JSON.parse(ev.data);
      } catch (err) {
        return;
      }
      if (m.type === "telemetry" && m.data) {
        wsBuffer.push({
          at: performance.now() / 1000,
          ts: m.data.timestamp,
          frame: m.data
        });
        if (wsBuffer.length > 20) wsBuffer.shift();
      }
    };
  }
  connectWS();"""

new_ws_block = """  const WS_URL = `ws://${window.location.hostname || "localhost"}:8765`;
  let ws = null;
  let wsConnected = false;
  let wsBuffer = [];
  let renderClock = null;

  function connectWS() {
    ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      console.log("[ws] Connected to spatial server");
      wsConnected = true;
      if (useFallbackSim) {
        useFallbackSim = false;
        clearEntities();
      }
    };
    ws.onclose = () => {
      console.warn("[ws] Disconnected from spatial server, falling back to mock simulation");
      wsConnected = false;
      ws = null;
      renderClock = null;
      wsBuffer = [];
      if (!useFallbackSim) {
        useFallbackSim = true;
        initFallbackSimulation();
        rebuildLocalRoads();
      }
      setTimeout(connectWS, 3000);
    };
    ws.onerror = (err) => {
      wsConnected = false;
    };
    ws.onmessage = (ev) => {
      let m;
      try {
        m = JSON.parse(ev.data);
      } catch (err) {
        return;
      }
      if (m.type === "init") {
        console.log("[ws] Received init payload with roads:", m.roads?.length);
        if (m.roads && m.roads.length > 0) {
          rebuildSmoothRoads(m.roads);
        }
      }
      else if (m.type === "telemetry" && m.data) {
        wsBuffer.push({
          at: performance.now() / 1000,
          ts: m.data.timestamp,
          frame: m.data
        });
        if (wsBuffer.length > 20) wsBuffer.shift();
      }
    };
  }
  connectWS();"""

code = code.replace(old_ws_block, new_ws_block)

# 8. Replace animation loop inside animate()
# First we find the LERP update logic inside animate()
target_animate_loop = """    truckObjects.forEach(t => {
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
            : (getZ(t.mesh.position.x + 75, t.mesh.position.z + 225) * 0.4 + 9);
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
            : (getZ(tower.currentPos.x + 75, tower.currentPos.z + 225) * 0.4);
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
    });"""

new_animate_loop = """    if (useFallbackSim) {
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
            t.mesh.position.y = na.y + (nb.y - na.y) * t.progress + 9;
            t.mesh.rotation.y = Math.atan2(nb.x - na.x, nb.z - na.z);
          }
        }
        const hexIcon = t.mesh.getObjectByName("hexIcon");
        if (hexIcon) hexIcon.rotation.y += 0.05;
        if (frame % 3 === 0) spawnDust(t.mesh.position.x, t.mesh.position.y - 5, t.mesh.position.z, t.mesh.rotation.y);
      });

      towerObjects.forEach(tower => {
        if (tower.battery === undefined) tower.battery = 80 + Math.random() * 20;
        tower.battery -= 0.015;
        if (tower.battery <= 0) tower.battery = 100;
        
        let targetColor = tower.battery >= 60 ? new THREE.Color(C.coverage) : tower.battery >= 20 ? new THREE.Color(0xffaa00) : ((frame % 20 < 10) ? new THREE.Color(0xff3333) : new THREE.Color(0x330000));
        tower.beacon.material.color.copy(targetColor);
        tower.bLight.color.copy(targetColor);
        if (tower.coverageSphere) tower.coverageSphere.material.color.copy(targetColor);
        if (tower.coverageWire) tower.coverageWire.material.color.copy(targetColor);

        const assignedTrucks = truckObjects.filter(truck => {
          let nearestTower = null, minDist = Infinity;
          towerObjects.forEach(t => {
            const d = Math.hypot(truck.mesh.position.x - t.currentPos.x, truck.mesh.position.z - t.currentPos.z);
            if (d < minDist) { minDist = d; nearestTower = t; }
          });
          return nearestTower === tower;
        });

        if (tower.currentNodeName !== tower.nextNodeName) {
          tower.progress += 0.015;
          if (tower.progress >= 1.0) {
            tower.progress = 1.0;
            tower.currentNodeName = tower.nextNodeName;
            if (tower.path.length > 1) tower.path.shift();
          }
        }

        if (tower.currentNodeName === tower.nextNodeName) {
          let targetNodeName = tower.homeNodeName;
          if (assignedTrucks.length > 0) {
            const sumX = assignedTrucks.reduce((sum, tk) => sum + tk.mesh.position.x, 0);
            const sumZ = assignedTrucks.reduce((sum, tk) => sum + tk.mesh.position.z, 0);
            const centroidX = sumX / assignedTrucks.length;
            const centroidZ = sumZ / assignedTrucks.length;
            let bestNodeName = null, bestD = Infinity;
            Object.entries(NODES).forEach(([name, node]) => {
              const d = Math.hypot(node.x - centroidX, node.z - centroidZ);
              if (d < bestD) { bestD = d; bestNodeName = name; }
            });
            if (bestNodeName) targetNodeName = bestNodeName;
          }
          if (targetNodeName !== tower.currentNodeName) {
            const newPath = findPath(tower.currentNodeName, targetNodeName);
            if (newPath && newPath.length > 1) {
              tower.path = newPath;
              tower.nextNodeName = newPath[1];
              tower.progress = 0.0;
            }
          }
        }

        const fromNode = tower.currentNodeName;
        const toNode = tower.nextNodeName;
        const curveKey = `${fromNode}_${toNode}`;
        const curve = roadCurves.get(curveKey);
        if (curve) {
          tower.currentPos.copy(curve.getPointAt(tower.progress));
        } else {
          const na = NODES[fromNode], nb = NODES[toNode];
          if (na && nb) {
            tower.currentPos.x = na.x + (nb.x - na.x) * tower.progress;
            tower.currentPos.z = na.z + (nb.z - na.z) * tower.progress;
            tower.currentPos.y = na.y + (nb.y - na.y) * tower.progress;
          }
        }
        if (tower.towerGrp) tower.towerGrp.position.copy(tower.currentPos);
        if (tower.coverageSphere) tower.coverageSphere.position.set(tower.currentPos.x, tower.currentPos.y + 95, tower.currentPos.z);
        if (tower.coverageWire) tower.coverageWire.position.copy(tower.coverageSphere.position);
        if (tower.tLbl) tower.tLbl.position.set(tower.currentPos.x, tower.currentPos.y + 102, tower.currentPos.z);
      });

      truckObjects.forEach(t => {
        let maxSignal = 10;
        towerObjects.forEach(tower => {
          const dist = Math.hypot(t.mesh.position.x - tower.currentPos.x, t.mesh.position.z - tower.currentPos.z);
          const rad = tower.coverageRadius;
          let sig = 10;
          if (dist <= rad * 0.6) sig = 100 - Math.floor((dist / (rad * 0.6)) * 15);
          else if (dist <= rad * 1.5) sig = Math.max(10, Math.round(85 * (1 - (dist - rad * 0.6) / (rad * 0.9))));
          if (sig > maxSignal) maxSignal = sig;
        });
        t.signal = maxSignal;
      });
    } else {
      // PLAYBACK LERP INTERPOLATION FROM WEBSOCKET SERVER telemetry snapshots
      const spacing = 0.033;
      const DELAY = 0.08;
      if (wsBuffer.length >= 2) {
        const first = wsBuffer[0];
        const last = wsBuffer[wsBuffer.length - 1];
        const rate = (last.ts - first.ts) / Math.max(1e-3, (last.at - first.at));
        
        const delta = 1 / 60; // assumed 60fps dt
        if (renderClock === null) renderClock = last.ts - DELAY;
        else renderClock += delta * rate;
        
        const target = last.ts - DELAY;
        if (Math.abs(target - renderClock) > 0.5) renderClock = target;
        renderClock = Math.max(first.ts, Math.min(last.ts, renderClock));
        
        let a = first, b = last;
        for (let i = 0; i < wsBuffer.length - 1; i++) {
          if (wsBuffer[i].ts <= renderClock && wsBuffer[i+1].ts >= renderClock) {
            a = wsBuffer[i]; b = wsBuffer[i+1];
            break;
          }
        }
        
        const f = Math.max(0, Math.min(1, (renderClock - a.ts) / Math.max(1e-6, b.ts - a.ts)));
        
        // Dynamic Spawning and Interpolation of Trucks
        const aTrucks = new Map();
        a.frame.trucks.forEach(t => aTrucks.set(t.id, t));
        const ids = new Set();
        
        b.frame.trucks.forEach(tb => {
          const id = tb.id;
          ids.add(id);
          const ta = aTrucks.get(id) || tb;
          
          const posA = simToWorld(ta.position[0], ta.position[1], ta.position[2]);
          const posB = simToWorld(tb.position[0], tb.position[1], tb.position[2]);
          const pos = posA.clone().lerp(posB, f);
          
          let tObj = truckObjects.find(x => x.id === id);
          if (!tObj) {
            tObj = spawnTruckObject(id, pos.x, pos.y, pos.z);
          }
          
          tObj.mesh.position.copy(pos);
          tObj.mesh.position.y += 9.0;
          
          const angleA = ta.yaw ?? 0;
          let angleB = tb.yaw ?? 0;
          let diff = angleB - angleA;
          diff = Math.atan2(Math.sin(diff), Math.cos(diff));
          tObj.mesh.rotation.y = angleA + diff * f;
          
          tObj.mesh.traverse(child => {
            if (child.isMesh && child.material) {
              if (child.name !== "hexIcon" && child.parent?.name !== "hexIcon") {
                const targetColor = tb.loaded ? C.truckBody : 0x1e6fd8;
                child.material.color.setHex(targetColor);
                child.material.emissive.setHex(targetColor);
              }
            }
          });
          
          tObj.speed = tb.speed_kmh;
          tObj.loaded = tb.loaded;
          tObj.op_state = tb.op_state;
          tObj.mass_kg = tb.mass_kg;
          tObj.fuel = 100;
          tObj.battery = 100;
          tObj.latency = 15;
          
          const hexIcon = tObj.mesh.getObjectByName("hexIcon");
          if (hexIcon) hexIcon.rotation.y += 0.05;
          if (frame % 3 === 0) spawnDust(tObj.mesh.position.x, tObj.mesh.position.y - 5, tObj.mesh.position.z, tObj.mesh.rotation.y);
        });
        
        for (let i = truckObjects.length - 1; i >= 0; i--) {
          if (!ids.has(truckObjects[i].id)) removeTruckObject(truckObjects[i].id);
        }
        
        // Dynamic Spawning and Interpolation of Towers
        const aTowers = new Map();
        a.frame.towers.forEach(t => aTowers.set(t.id, t));
        const tIds = new Set();
        
        b.frame.towers.forEach(tb => {
          const id = tb.id;
          tIds.add(id);
          const ta = aTowers.get(id) || tb;
          
          const posA = simToWorld(ta.position[0], ta.position[1], ta.position[2]);
          const posB = simToWorld(tb.position[0], tb.position[1], tb.position[2]);
          const pos = posA.clone().lerp(posB, f);
          
          let tObj = towerObjects.find(x => x.id === id);
          if (!tObj) {
            tObj = spawnTowerObject(id, pos.x, pos.y, pos.z, tb.comm_radius_m || 250, tb.battery_pct, tb.active, tb.color || [230, 60, 60], towerObjects.length);
          }
          
          tObj.currentPos.copy(pos);
          if (tObj.towerGrp) tObj.towerGrp.position.copy(pos);
          
          const active = tb.active !== false;
          tObj.active = active;
          tObj.battery = tb.battery_pct;
          tObj.coverageRadius = (tb.comm_radius_m || 250) * COV_SCALE;
          
          let targetColor = tObj.battery >= 60 ? new THREE.Color(C.coverage) : tObj.battery >= 20 ? new THREE.Color(0xffaa00) : ((frame % 20 < 10) ? new THREE.Color(0xff3333) : new THREE.Color(0x330000));
          tObj.beacon.material.color.copy(targetColor);
          tObj.bLight.color.copy(targetColor);
          if (tObj.coverageSphere) {
            tObj.coverageSphere.position.set(pos.x, pos.y + 95, pos.z);
            tObj.coverageSphere.material.color.copy(targetColor);
            tObj.coverageSphere.visible = active;
            tObj.coverageSphere.scale.setScalar(tObj.coverageRadius / (tObj.initialDbRadius * COV_SCALE));
          }
          if (tObj.coverageWire) {
            tObj.coverageWire.position.copy(tObj.coverageSphere.position);
            tObj.coverageWire.material.color.copy(targetColor);
            tObj.coverageWire.visible = active;
            tObj.coverageWire.scale.setScalar(tObj.coverageRadius / (tObj.initialDbRadius * COV_SCALE));
          }
          if (tObj.tLbl) tObj.tLbl.position.set(pos.x, pos.y + 102, pos.z);
        });
        
        for (let i = towerObjects.length - 1; i >= 0; i--) {
          if (!tIds.has(towerObjects[i].id)) removeTowerObject(towerObjects[i].id);
        }
        
        // Signal calculations in WS mode
        truckObjects.forEach(t => {
          let maxSignal = 10;
          towerObjects.forEach(tower => {
            if (!tower.active) return;
            const dist = Math.hypot(t.mesh.position.x - tower.currentPos.x, t.mesh.position.z - tower.currentPos.z);
            const rad = tower.coverageRadius;
            let sig = 10;
            if (dist <= rad * 0.6) sig = 100 - Math.floor((dist / (rad * 0.6)) * 15);
            else if (dist <= rad * 1.5) sig = Math.max(10, Math.round(85 * (1 - (dist - rad * 0.6) / (rad * 0.9))));
            if (sig > maxSignal) maxSignal = sig;
          });
          t.signal = maxSignal;
        });
      }
    }"""

code = code.replace(target_animate_loop, new_animate_loop)

# 9. Add sendCommand API exposure in return block
old_return_block = """    resetCamera: () => { camera.position.set(0,1000,1400); controls.target.set(0,0,0); controls.update(); },
    toggleHeatmap: () => heatmap.toggle(),
    cleanup: () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("click", onContainerClick);
      heatmap.dispose();
      renderer.dispose();
      if (legendEl.parentNode) legendEl.parentNode.removeChild(legendEl);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    },"""

new_return_block = """    resetCamera: () => { camera.position.set(0,1000,1400); controls.target.set(0,0,0); controls.update(); },
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
    },"""

code = code.replace(old_return_block, new_return_block)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Integration script finished successfully.")
