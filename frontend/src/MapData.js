/**
 * mapData.js  —  MAP_3d_data.py converted to JavaScript
 * All _RAW values use [x, y] arrays (not Python tuples).
 * World is centered at origin: raw centroid (75, 225) subtracted.
 */

// ── Raw node positions [x, y] ─────────────────────────────────────────
const _RAW = {
  connector_1_1:    [150, 140],  connector_1_2:    [100, 100],  connector_1_3:    [ 70, 150],
  connector_2_2:    [250, 250],  connector_2_3:    [260, 280],
  dump_hub_1a:      [180, 280],  dump_hub_1b:      [200, 280],
  dump_spur_1a_1:   [190, 310],  dump_spur_1a_2:   [180, 320],
  dump_spur_1b_1:   [210, 310],  dump_spur_1b_2:   [220, 320],
  dump_zone_1:      [180, 340],  dump_zone_2:      [220, 340],
  dump_zone_3:      [650, 180],  dump_zone_4:      [700, 180],  dump_zone_5:      [750, 180],
  dump_zone_6:      [650, 130],  dump_zone_7:      [700, 130],  dump_zone_8:      [750, 130],
  dump_zone_9:      [650, 320],  dump_zone_10:     [700, 320],  dump_zone_11:     [750, 320],
  dump_zone_12:     [650, 370],  dump_zone_13:     [700, 370],  dump_zone_14:     [750, 370],
  dump_zone_15:     [ 50, 740],  dump_zone_16:     [150, 790],  dump_zone_17:     [250, 740],
  dump_zone_18:     [-50, 740],  dump_zone_19:     [ 50, 840],  dump_zone_20:     [250, 840],
  dump_zone_21:     [350, 740],  dump_zone_22:     [-170,450],  dump_zone_23:     [-100,520],
  dump_zone_24:     [-30,  450],
  e_connector_n:    [750, 225],  e_connector_s:    [750, 275],
  e_grid_1_a:       [600, 200],  e_grid_1_b:       [650, 200],  e_grid_1_c:       [700, 200],  e_grid_1_d: [750, 200],
  e_grid_2_a:       [600, 150],  e_grid_2_b:       [650, 150],  e_grid_2_c:       [700, 150],  e_grid_2_d: [750, 150],
  e_grid_3_a:       [600, 300],  e_grid_3_b:       [650, 300],  e_grid_3_c:       [700, 300],  e_grid_3_d: [750, 300],
  e_grid_4_a:       [600, 350],  e_grid_4_b:       [650, 350],  e_grid_4_c:       [700, 350],  e_grid_4_d: [750, 350],
  e_haul_1:         [300, 250],  e_haul_2:         [400, 250],  e_haul_3:         [500, 250],  e_hub:      [600, 250],
  fuel_1:           [700, 630],  fuel_2:           [700, 670],
  fw_haul_1:        [-50,  250], fw_haul_2:        [-150, 250], fw_haul_3:        [-250, 250], fw_hub:     [-350, 250],
  fw_load_spur_1:   [-470, 150], fw_load_spur_2:   [-500, 270], fw_load_spur_3:   [-450, 370], fw_load_spur_4:  [-300, 320],
  fw_load_spur_5:   [-520, 100], fw_load_spur_6:   [-550, 270], fw_load_spur_7:   [-500, 420], fw_load_spur_8:  [-250, 370],
  fw_load_spur_9:   [-570,  50], fw_load_spur_10:  [-600, 270], fw_load_spur_11:  [-550, 470], fw_load_spur_12: [-200, 420],
  fw_pit_1_a:       [-350, 150], fw_pit_1_b:       [-450, 150], fw_pit_1_c:       [-500, 250],
  fw_pit_1_d:       [-450, 350], fw_pit_1_e:       [-350, 350], fw_pit_1_f:       [-300, 300], fw_pit_1_g: [-300, 200],
  fw_pit_2_a:       [-350, 100], fw_pit_2_b:       [-500, 100], fw_pit_2_c:       [-550, 250],
  fw_pit_2_d:       [-500, 400], fw_pit_2_e:       [-350, 400], fw_pit_2_f:       [-250, 350], fw_pit_2_g: [-250, 150],
  fw_pit_3_a:       [-350,  50], fw_pit_3_b:       [-550,  50], fw_pit_3_c:       [-600, 250],
  fw_pit_3_d:       [-550, 450], fw_pit_3_e:       [-350, 450], fw_pit_3_f:       [-200, 400], fw_pit_3_g: [-200, 100],
  ix_east_1:        [180, 250],  ix_east_2:        [200, 250],
  ix_north_1:       [150, 220],  ix_north_2:       [150, 200],
  ix_west_1:        [120, 250],  ix_west_2:        [100, 250],
  load_hub_1a:      [120, 200],  load_hub_1b:      [100, 200],
  load_hub_2a:      [180, 200],  load_hub_2b:      [200, 200],
  load_spur_1a_1:   [ 90, 190],  load_spur_1a_2:   [ 80, 180],
  load_spur_1b_1:   [110, 190],  load_spur_1b_2:   [120, 180],
  load_spur_2a_1:   [190, 170],  load_spur_2a_2:   [180, 150],
  load_spur_2b_1:   [210, 170],  load_spur_2b_2:   [220, 150],
  load_zone_1:      [ 80, 160],  load_zone_2:      [120, 160],  load_zone_3:      [200, 120],
  load_zone_4:      [-490, 150], load_zone_5:      [-500, 290], load_zone_6:      [-450, 390], load_zone_7:  [-300, 340],
  load_zone_8:      [-540, 100], load_zone_9:      [-550, 290], load_zone_10:     [-500, 440], load_zone_11: [-250, 390],
  load_zone_12:     [-590,  50], load_zone_13:     [-600, 290], load_zone_14:     [-550, 490], load_zone_15: [-200, 440],
  load_zone_16:     [  50,-290], load_zone_17:     [ 150,-340], load_zone_18:     [ 250,-290],
  load_zone_19:     [   0,-290], load_zone_20:     [ 150,-390], load_zone_21:     [ 300,-290],
  load_zone_22:     [-170, 400], load_zone_23:     [-100, 330],
  load_zone_24:     [ 500,-190], load_zone_25:     [ 600,-240], load_zone_26:     [ 700,-190],
  load_zone_27:     [ 450,-190], load_zone_28:     [ 600,-290], load_zone_29:     [ 750,-190],
  main_hub:         [150,  250],
  n_haul_1:         [150,  100], n_haul_2:         [150,    0], n_haul_3:         [150, -100], n_hub: [150, -200],
  n_load_spur_1:    [ 50, -270], n_load_spur_2:    [150, -320], n_load_spur_3:    [250, -270],
  n_load_spur_4:    [  0, -270], n_load_spur_5:    [150, -370], n_load_spur_6:    [300, -270],
  n_q_1_a:          [100, -200], n_q_1_b:          [ 50, -250], n_q_1_c:          [100, -300],
  n_q_1_d:          [200, -300], n_q_1_e:          [250, -250], n_q_1_f:          [200, -200],
  n_q_2_a:          [ 50, -200], n_q_2_b:          [  0, -250], n_q_2_c:          [ 50, -350],
  n_q_2_d:          [250, -350], n_q_2_e:          [300, -250], n_q_2_f:          [250, -200],
  ne_haul_1:        [600,  100], ne_haul_2:        [600,    0], ne_hub:           [600, -100],
  ne_load_spur_1:   [500, -170], ne_load_spur_2:   [600, -220], ne_load_spur_3:   [700, -170],
  ne_load_spur_4:   [450, -170], ne_load_spur_5:   [600, -290], ne_load_spur_6:   [750, -170],
  ne_q_1_a:         [550, -100], ne_q_1_b:         [500, -150], ne_q_1_c:         [550, -200],
  ne_q_1_d:         [650, -200], ne_q_1_e:         [700, -150], ne_q_1_f:         [650, -100],
  ne_q_2_a:         [500, -100], ne_q_2_b:         [450, -150], ne_q_2_c:         [500, -250],
  ne_q_2_d:         [700, -250], ne_q_2_e:         [750, -150], ne_q_2_f:         [700, -100],
  parking_1:        [500,  630], parking_2:        [500,  670],
  purple_auto_fix_1:[  80, 166], purple_auto_fix_2:[-200, 250], purple_auto_fix_3:[-300, 250],
  s_connector_1:    [  0,  550], s_connector_2:    [-50,  450],
  s_dump_spur_1:    [ 50,  720], s_dump_spur_2:    [150,  770], s_dump_spur_3:    [250,  720],
  s_dump_spur_4:    [-50,  720], s_dump_spur_5:    [ 50,  820], s_dump_spur_6:    [250,  820], s_dump_spur_7: [350, 720],
  s_haul_1:         [150,  350], s_haul_2:         [150,  450], s_haul_3:         [150,  550], s_hub: [150, 650],
  s_sp_1_a:         [100,  650], s_sp_1_b:         [ 50,  700], s_sp_1_c:         [100,  750],
  s_sp_1_d:         [200,  750], s_sp_1_e:         [250,  700], s_sp_1_f:         [200,  650],
  s_sp_2_a:         [  0,  650], s_sp_2_b:         [-50,  700], s_sp_2_c:         [  0,  750],
  s_sp_2_d:         [100,  800], s_sp_2_e:         [200,  800], s_sp_2_f:         [300,  750],
  s_sp_2_g:         [350,  700], s_sp_2_h:         [300,  650],
  service_exit_1:   [150,  280], service_exit_2:   [160,  270],
  service_haul_1:   [600,  400], service_haul_2:   [600,  500], service_hub:      [600,  600],
  service_loop_1:   [550,  600], service_loop_2:   [500,  650], service_loop_3:   [550,  700],
  service_loop_4:   [650,  700], service_loop_5:   [700,  650], service_loop_6:   [650,  600],
  start_zone:       [150,  300],
  sw_connector_1:   [-100, 400], sw_connector_2:   [-50,  350],
  sw_dump_spur_1:   [-150, 450], sw_dump_spur_2:   [-100, 500], sw_dump_spur_3:   [-50,  450],
  sw_haul_1:        [100,  300], sw_haul_2:        [ 50,  350], sw_haul_3:        [  0,  400], sw_hub: [-100, 450],
  sw_load_spur_1:   [-150, 400], sw_load_spur_2:   [-100, 350],
};

// ── Centroid offset: X centre=75, Y centre=225 ────────────────────────
const OX = 75;
const OY = 225;

// ── Terrain height (matches Python _get_z) ────────────────────────────
const PIT_CENTERS = [
  { x: -425, y: 250 },  // fw pits
  { x:  150, y: -275 }, // n  pits
  { x:  600, y: -175 }, // ne pits
  { x:  150, y:  700 }, // s  pits
];

export function getZ(rx, ry) {
  let base = 0.02 * rx + 0.015 * ry
           + 20 * Math.sin(rx / 200)
           + 15 * Math.cos(ry / 150);
  for (const { x: cx, y: cy } of PIT_CENTERS) {
    const d = Math.hypot(rx - cx, ry - cy);
    if (d < 220) base -= (220 - d) * 1.3;
  }
  return base;
}

// ── Build NODES ───────────────────────────────────────────────────────
export const NODES = {};
for (const [name, value] of Object.entries(_RAW)) {

     console.log(name, value);

  if (!Array.isArray(value)) {
    console.error("BAD NODE:", name, value);
    continue;
  }

  const [rx, ry] = value;

  console.log(
    name,
    "height:",
    getZ(rx, ry)
  );

  const wx = rx - OX;
  const wy = ry - OY;

  let yVal = getZ(rx, ry) * 0.04;
  
  // FW Pit adjustments
  const fwDeep = [
    "fw_pit_1_a", "fw_pit_1_b", "fw_pit_1_c", "fw_pit_1_d", "fw_pit_1_e", "fw_pit_1_f", "fw_pit_1_g",
    "fw_load_spur_1", "fw_load_spur_2", "fw_load_spur_3", "fw_load_spur_4",
    "load_zone_4", "load_zone_5", "load_zone_6", "load_zone_7"
  ];
  const fwMid = [
    "fw_pit_2_a", "fw_pit_2_b", "fw_pit_2_c", "fw_pit_2_d", "fw_pit_2_e", "fw_pit_2_f", "fw_pit_2_g",
    "fw_load_spur_5", "fw_load_spur_6", "fw_load_spur_7", "fw_load_spur_8",
    "load_zone_8", "load_zone_9", "load_zone_10", "load_zone_11"
  ];
  
  // North Pit adjustments
  const nDeep = [
    "n_q_1_a", "n_q_1_b", "n_q_1_c", "n_q_1_d", "n_q_1_e", "n_q_1_f",
    "n_load_spur_1", "n_load_spur_2", "n_load_spur_3",
    "load_zone_16", "load_zone_17", "load_zone_18"
  ];
  
  // Northeast Pit adjustments
  const neDeep = [
    "ne_q_1_a", "ne_q_1_b", "ne_q_1_c", "ne_q_1_d", "ne_q_1_e", "ne_q_1_f",
    "ne_load_spur_1", "ne_load_spur_2", "ne_load_spur_3",
    "load_zone_24", "load_zone_25", "load_zone_26"
  ];
  
  // South Pit adjustments
  const sDeep = [
    "s_sp_1_a", "s_sp_1_b", "s_sp_1_c", "s_sp_1_d", "s_sp_1_e", "s_sp_1_f",
    "s_dump_spur_1", "s_dump_spur_2", "s_dump_spur_3",
    "dump_zone_15", "dump_zone_16", "dump_zone_17"
  ];

  if (fwDeep.includes(name)) {
    yVal = -70;
  } else if (fwMid.includes(name)) {
    yVal = -35;
  } else if (nDeep.includes(name)) {
    yVal = -65;
  } else if (neDeep.includes(name)) {
    yVal = -65;
  } else if (sDeep.includes(name)) {
    yVal = -65;
  }

  NODES[name] = {
    x: wx,
    y: yVal,
    z: wy,
  };
}

// ── Zone sets ─────────────────────────────────────────────────────────
export const LOAD_ZONES = new Set([
  "load_zone_1","load_zone_2","load_zone_3","load_zone_4","load_zone_5",
  "load_zone_6","load_zone_7","load_zone_8","load_zone_9","load_zone_10",
  "load_zone_11","load_zone_12","load_zone_13","load_zone_14","load_zone_15",
  "load_zone_16","load_zone_17","load_zone_18","load_zone_19","load_zone_20",
  "load_zone_21","load_zone_22","load_zone_23","load_zone_24","load_zone_25",
  "load_zone_26","load_zone_27","load_zone_28","load_zone_29",
]);
export const DUMP_ZONES = new Set([
  "dump_zone_1","dump_zone_2","dump_zone_3","dump_zone_4","dump_zone_5",
  "dump_zone_6","dump_zone_7","dump_zone_8","dump_zone_9","dump_zone_10",
  "dump_zone_11","dump_zone_12","dump_zone_13","dump_zone_14","dump_zone_15",
  "dump_zone_16","dump_zone_17","dump_zone_18","dump_zone_19","dump_zone_20",
  "dump_zone_21","dump_zone_22","dump_zone_23","dump_zone_24",
  "parking_1","parking_2",
]);
export const FUEL_ZONES  = new Set(["fuel_1","fuel_2"]);
export const HUB_NODES   = new Set(["main_hub","n_hub","ne_hub","s_hub","e_hub","fw_hub","sw_hub","service_hub"]);

// ── Edges ─────────────────────────────────────────────────────────────
export const EDGES = [
  ["connector_1_1","connector_1_2"],["connector_1_1","n_haul_1"],
  ["connector_1_2","connector_1_3"],["connector_1_3","purple_auto_fix_1"],
  ["connector_2_2","connector_2_3"],["connector_2_2","e_haul_1"],
  ["connector_2_2","ix_east_2"],["connector_2_3","dump_zone_2"],
  ["dump_hub_1a","dump_hub_1b"],["dump_hub_1a","s_haul_1"],
  ["dump_hub_1b","dump_spur_1a_1"],["dump_hub_1b","dump_spur_1b_1"],
  ["dump_spur_1a_1","dump_spur_1a_2"],["dump_spur_1a_2","dump_zone_1"],
  ["dump_spur_1b_1","dump_spur_1b_2"],["dump_spur_1b_2","dump_zone_2"],
  ["e_connector_n","e_connector_s"],
  ["e_grid_1_a","e_grid_1_b"],["e_grid_1_a","e_grid_2_a"],["e_grid_1_a","ne_haul_1"],
  ["e_grid_1_b","dump_zone_3"],["e_grid_1_b","e_grid_1_c"],["e_grid_1_b","e_grid_2_b"],
  ["e_grid_1_c","dump_zone_4"],["e_grid_1_c","e_grid_1_d"],["e_grid_1_c","e_grid_2_c"],
  ["e_grid_1_d","dump_zone_5"],["e_grid_1_d","e_connector_n"],["e_grid_1_d","e_grid_2_d"],
  ["e_grid_2_a","e_grid_2_b"],["e_grid_2_b","dump_zone_6"],["e_grid_2_b","e_grid_2_c"],
  ["e_grid_2_c","dump_zone_7"],["e_grid_2_c","e_grid_2_d"],
  ["e_grid_2_d","dump_zone_8"],["e_grid_2_d","e_connector_n"],
  ["e_grid_3_a","e_grid_3_b"],["e_grid_3_a","e_grid_4_a"],
  ["e_grid_3_b","dump_zone_9"],["e_grid_3_b","e_grid_3_c"],["e_grid_3_b","e_grid_4_b"],
  ["e_grid_3_c","dump_zone_10"],["e_grid_3_c","e_grid_3_d"],["e_grid_3_c","e_grid_4_c"],
  ["e_grid_3_d","dump_zone_11"],["e_grid_3_d","e_connector_s"],["e_grid_3_d","e_grid_4_d"],
  ["e_grid_4_a","e_grid_4_b"],["e_grid_4_a","service_haul_1"],
  ["e_grid_4_b","dump_zone_12"],["e_grid_4_b","e_grid_4_c"],
  ["e_grid_4_c","dump_zone_13"],["e_grid_4_c","e_grid_4_d"],
  ["e_grid_4_d","dump_zone_14"],["e_grid_4_d","e_connector_s"],
  ["e_haul_1","e_haul_2"],["e_haul_2","e_haul_3"],["e_haul_3","e_hub"],
  ["e_hub","e_grid_1_a"],["e_hub","e_grid_3_a"],
  ["fw_haul_1","fw_haul_2"],["fw_haul_2","purple_auto_fix_2"],
  ["fw_haul_3","purple_auto_fix_2"],["fw_haul_3","purple_auto_fix_3"],
  ["fw_hub","fw_pit_1_a"],["fw_hub","purple_auto_fix_3"],
  ["fw_load_spur_1","load_zone_4"],["fw_load_spur_2","load_zone_5"],
  ["fw_load_spur_3","load_zone_6"],["fw_load_spur_4","load_zone_7"],
  ["fw_load_spur_5","load_zone_8"],["fw_load_spur_6","load_zone_9"],
  ["fw_load_spur_7","load_zone_10"],["fw_load_spur_8","load_zone_11"],
  ["fw_load_spur_9","load_zone_12"],["fw_load_spur_10","load_zone_13"],
  ["fw_load_spur_11","load_zone_14"],["fw_load_spur_12","load_zone_15"],
  ["fw_pit_1_a","fw_pit_1_b"],["fw_pit_1_a","fw_pit_2_a"],
  ["fw_pit_1_b","fw_load_spur_1"],["fw_pit_1_b","fw_pit_1_c"],
  ["fw_pit_1_c","fw_load_spur_2"],["fw_pit_1_c","fw_pit_1_d"],
  ["fw_pit_1_d","fw_load_spur_3"],["fw_pit_1_d","fw_pit_1_e"],
  ["fw_pit_1_e","fw_pit_1_f"],["fw_pit_1_e","fw_pit_2_e"],
  ["fw_pit_1_f","fw_load_spur_4"],["fw_pit_1_f","purple_auto_fix_3"],
  ["fw_pit_1_g","fw_pit_1_a"],["fw_pit_1_g","fw_pit_2_g"],["fw_pit_1_g","purple_auto_fix_3"],
  ["fw_pit_2_a","fw_pit_2_b"],["fw_pit_2_a","fw_pit_3_a"],
  ["fw_pit_2_b","fw_load_spur_5"],["fw_pit_2_b","fw_pit_2_c"],
  ["fw_pit_2_c","fw_load_spur_6"],["fw_pit_2_c","fw_pit_2_d"],
  ["fw_pit_2_d","fw_load_spur_7"],["fw_pit_2_d","fw_pit_2_e"],
  ["fw_pit_2_e","fw_pit_2_f"],["fw_pit_2_e","fw_pit_3_e"],
  ["fw_pit_2_f","fw_load_spur_8"],["fw_pit_2_f","fw_pit_2_g"],
  ["fw_pit_2_g","fw_pit_2_a"],["fw_pit_2_g","fw_pit_3_g"],
  ["fw_pit_3_a","fw_pit_3_b"],["fw_pit_3_b","fw_load_spur_9"],["fw_pit_3_b","fw_pit_3_c"],
  ["fw_pit_3_c","fw_load_spur_10"],["fw_pit_3_c","fw_pit_3_d"],
  ["fw_pit_3_d","fw_load_spur_11"],["fw_pit_3_d","fw_pit_3_e"],
  ["fw_pit_3_e","fw_pit_3_f"],["fw_pit_3_f","fw_load_spur_12"],["fw_pit_3_f","purple_auto_fix_2"],
  ["fw_pit_3_g","fw_pit_3_a"],["fw_pit_3_g","purple_auto_fix_2"],
  ["ix_east_1","ix_east_2"],["ix_east_2","dump_hub_1b"],
  ["ix_east_2","e_haul_1"],["ix_east_2","load_hub_2b"],
  ["ix_north_1","ix_north_2"],
  ["ix_north_2","load_hub_1a"],["ix_north_2","load_hub_2a"],["ix_north_2","n_haul_1"],
  ["ix_west_1","ix_west_2"],["ix_west_2","connector_1_3"],
  ["ix_west_2","fw_haul_1"],["ix_west_2","load_hub_1b"],
  ["load_hub_1a","load_hub_1b"],
  ["load_hub_1b","load_spur_1a_1"],["load_hub_1b","load_spur_1b_1"],["load_hub_1b","purple_auto_fix_1"],
  ["load_hub_2a","load_hub_2b"],
  ["load_hub_2b","load_spur_2a_1"],["load_hub_2b","load_spur_2b_1"],
  ["load_spur_1a_1","load_spur_1a_2"],["load_spur_1a_2","purple_auto_fix_1"],
  ["load_spur_1b_1","load_spur_1b_2"],["load_spur_1b_2","load_zone_2"],
  ["load_spur_2a_1","load_spur_2a_2"],["load_spur_2a_2","load_zone_3"],
  ["load_spur_2b_1","load_spur_2b_2"],["load_spur_2b_2","load_zone_3"],
  ["load_zone_1","purple_auto_fix_1"],["load_zone_3","connector_1_1"],
  ["main_hub","dump_hub_1a"],["main_hub","ix_east_1"],["main_hub","ix_north_1"],
  ["main_hub","ix_west_1"],["main_hub","sw_haul_1"],
  ["n_haul_1","n_haul_2"],["n_haul_2","n_haul_3"],["n_haul_3","n_hub"],
  ["n_hub","n_q_1_a"],
  ["n_load_spur_1","load_zone_16"],["n_load_spur_2","load_zone_17"],
  ["n_load_spur_3","load_zone_18"],["n_load_spur_4","load_zone_19"],
  ["n_load_spur_5","load_zone_20"],["n_load_spur_6","load_zone_21"],
  ["n_q_1_a","n_q_1_b"],["n_q_1_a","n_q_2_a"],
  ["n_q_1_b","n_load_spur_1"],["n_q_1_b","n_q_1_c"],
  ["n_q_1_c","n_load_spur_2"],["n_q_1_c","n_q_1_d"],
  ["n_q_1_d","n_q_1_e"],["n_q_1_e","n_load_spur_3"],["n_q_1_e","n_q_1_f"],
  ["n_q_1_f","n_hub"],
  ["n_q_2_a","n_q_2_b"],["n_q_2_b","n_load_spur_4"],["n_q_2_b","n_q_2_c"],
  ["n_q_2_c","n_load_spur_5"],["n_q_2_c","n_q_2_d"],
  ["n_q_2_d","n_q_2_e"],["n_q_2_e","n_load_spur_6"],["n_q_2_e","n_q_2_f"],
  ["n_q_2_f","n_q_1_f"],
  ["ne_haul_1","ne_haul_2"],["ne_haul_2","ne_hub"],["ne_hub","ne_q_1_a"],
  ["ne_load_spur_1","load_zone_24"],["ne_load_spur_2","load_zone_25"],
  ["ne_load_spur_3","load_zone_26"],["ne_load_spur_4","load_zone_27"],
  ["ne_load_spur_5","load_zone_28"],["ne_load_spur_6","load_zone_29"],
  ["ne_q_1_a","ne_q_1_b"],["ne_q_1_a","ne_q_2_a"],
  ["ne_q_1_b","ne_load_spur_1"],["ne_q_1_b","ne_q_1_c"],
  ["ne_q_1_c","ne_load_spur_2"],["ne_q_1_c","ne_q_1_d"],
  ["ne_q_1_d","ne_q_1_e"],["ne_q_1_e","ne_load_spur_3"],["ne_q_1_e","ne_q_1_f"],
  ["ne_q_1_f","ne_hub"],
  ["ne_q_2_a","ne_q_2_b"],["ne_q_2_b","ne_load_spur_4"],["ne_q_2_b","ne_q_2_c"],
  ["ne_q_2_c","ne_load_spur_5"],["ne_q_2_c","ne_q_2_d"],
  ["ne_q_2_d","ne_q_2_e"],["ne_q_2_e","ne_load_spur_6"],["ne_q_2_e","ne_q_2_f"],
  ["ne_q_2_f","ne_q_1_f"],
  ["s_connector_1","s_connector_2"],["s_connector_2","sw_hub"],
  ["s_dump_spur_1","dump_zone_15"],["s_dump_spur_2","dump_zone_16"],
  ["s_dump_spur_3","dump_zone_17"],["s_dump_spur_4","dump_zone_18"],
  ["s_dump_spur_5","dump_zone_19"],["s_dump_spur_6","dump_zone_20"],
  ["s_dump_spur_7","dump_zone_21"],
  ["s_haul_1","s_haul_2"],["s_haul_2","s_haul_3"],
  ["s_haul_3","s_connector_1"],["s_haul_3","s_hub"],
  ["s_hub","s_sp_1_a"],
  ["s_sp_1_a","s_sp_1_b"],["s_sp_1_a","s_sp_2_a"],
  ["s_sp_1_b","s_dump_spur_1"],["s_sp_1_b","s_sp_1_c"],
  ["s_sp_1_c","s_dump_spur_2"],["s_sp_1_c","s_sp_1_d"],
  ["s_sp_1_d","s_sp_1_e"],["s_sp_1_e","s_dump_spur_3"],["s_sp_1_e","s_sp_1_f"],
  ["s_sp_1_f","s_hub"],
  ["s_sp_2_a","s_sp_2_b"],["s_sp_2_b","s_dump_spur_4"],["s_sp_2_b","s_sp_2_c"],
  ["s_sp_2_c","s_sp_2_d"],["s_sp_2_d","s_dump_spur_5"],["s_sp_2_d","s_sp_2_e"],
  ["s_sp_2_e","s_dump_spur_6"],["s_sp_2_e","s_sp_2_f"],
  ["s_sp_2_f","s_sp_2_g"],["s_sp_2_g","s_dump_spur_7"],["s_sp_2_g","s_sp_2_h"],
  ["s_sp_2_h","s_sp_1_f"],
  ["service_exit_1","service_exit_2"],["service_exit_2","main_hub"],
  ["service_haul_1","service_haul_2"],["service_haul_2","service_hub"],
  ["service_hub","service_loop_1"],["service_hub","service_loop_6"],
  ["service_loop_1","service_loop_2"],
  ["service_loop_2","parking_1"],["service_loop_2","parking_2"],
  ["service_loop_2","service_loop_3"],["service_loop_3","service_loop_4"],
  ["service_loop_5","fuel_1"],["service_loop_5","fuel_2"],
  ["service_loop_5","service_loop_4"],["service_loop_6","service_loop_5"],
  ["start_zone","service_exit_1"],
  ["sw_connector_1","sw_haul_3"],["sw_connector_2","sw_haul_3"],
  ["sw_dump_spur_1","dump_zone_22"],["sw_dump_spur_2","dump_zone_23"],
  ["sw_dump_spur_3","dump_zone_24"],
  ["sw_haul_1","sw_haul_2"],["sw_haul_2","sw_haul_3"],["sw_haul_3","sw_hub"],
  ["sw_hub","sw_dump_spur_1"],["sw_hub","sw_dump_spur_2"],["sw_hub","sw_dump_spur_3"],
  ["sw_hub","sw_load_spur_1"],["sw_hub","sw_load_spur_2"],
  ["sw_load_spur_1","load_zone_22"],["sw_load_spur_2","load_zone_23"],
  ["connector_2_2","ix_east_2"],["ix_north_2","connector_1_1"],
].filter(([a, b]) => NODES[a] && NODES[b]);

// ── Road graph ────────────────────────────────────────────────────────
export const ROAD_GRAPH = {};
for (const name of Object.keys(NODES)) ROAD_GRAPH[name] = [];
for (const [a, b] of EDGES) {
  const d = Math.hypot(NODES[a].x - NODES[b].x, NODES[a].z - NODES[b].z);
  ROAD_GRAPH[a].push({ node: b, dist: d });
  ROAD_GRAPH[b].push({ node: a, dist: d });
}

// ── Dijkstra ──────────────────────────────────────────────────────────
export function findPath(from, to) {
  if (!NODES[from] || !NODES[to]) return null;
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
      if (nd < dist[nb]) { dist[nb] = nd; prev[nb] = cur; queue.push({ node: nb, d: nd }); }
    }
  }
  const path = [];
  let cur = to;
  while (cur) { path.unshift(cur); cur = prev[cur]; }
  return path[0] === from ? path : [from, to];
}

// ── Truck route assignments ───────────────────────────────────────────
const LOAD_ZONE_LIST = [...LOAD_ZONES];
const DUMP_ZONE_LIST = [...DUMP_ZONES].filter(n => NODES[n]);

export function getTruckRoutes(count = 20) {
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
    return { id: `TRK${String(i + 1).padStart(3, "0")}`, loadZone, dumpZone: bestDump };
  });
}

// ── World bounds ──────────────────────────────────────────────────────
export const WORLD_BOUNDS = {
  minX: -600 - OX, maxX: 750 - OX,
  minZ: -390 - OY, maxZ: 840 - OY,
  centerX: 0, centerZ: 0,
  spanX: 1350, spanZ: 1230,
};


// /**
//  * mapData.js
//  * All coordinate data from MAP_3d_data.py converted to JavaScript.
//  * X range: -600 to 750   Y range: -390 to 740
//  * We translate everything so world-center = (0,0), then scale to fit Three.js world.
//  *
//  * SCALE: 1 Python unit = 1 Three.js unit (map is ~1350 × 1130 units wide)
//  * We offset so the map centroid sits at THREE origin (0,0,0).
//  */

// // ── Raw nodes (x, y) from Python ──────────────────────────────────────
// const _RAW = {
//   connector_1_1:(150,140),  connector_1_2:(100,100),  connector_1_3:(70,150),
//   connector_2_2:(250,250),  connector_2_3:(260,280),
//   dump_hub_1a:(180,280),    dump_hub_1b:(200,280),
//   dump_spur_1a_1:(190,310), dump_spur_1a_2:(180,320),
//   dump_spur_1b_1:(210,310), dump_spur_1b_2:(220,320),
//   dump_zone_1:(180,340),    dump_zone_2:(220,340),
//   dump_zone_3:(650,180),    dump_zone_4:(700,180),    dump_zone_5:(750,180),
//   dump_zone_6:(650,130),    dump_zone_7:(700,130),    dump_zone_8:(750,130),
//   dump_zone_9:(650,320),    dump_zone_10:(700,320),   dump_zone_11:(750,320),
//   dump_zone_12:(650,370),   dump_zone_13:(700,370),   dump_zone_14:(750,370),
//   dump_zone_15:(50,740),    dump_zone_16:(150,790),   dump_zone_17:(250,740),
//   dump_zone_18:(-50,740),   dump_zone_19:(50,840),    dump_zone_20:(250,840),
//   dump_zone_21:(350,740),   dump_zone_22:(-170,450),  dump_zone_23:(-100,520),
//   dump_zone_24:(-30,450),
//   e_connector_n:(750,225),  e_connector_s:(750,275),
//   e_grid_1_a:(600,200),     e_grid_1_b:(650,200),     e_grid_1_c:(700,200),  e_grid_1_d:(750,200),
//   e_grid_2_a:(600,150),     e_grid_2_b:(650,150),     e_grid_2_c:(700,150),  e_grid_2_d:(750,150),
//   e_grid_3_a:(600,300),     e_grid_3_b:(650,300),     e_grid_3_c:(700,300),  e_grid_3_d:(750,300),
//   e_grid_4_a:(600,350),     e_grid_4_b:(650,350),     e_grid_4_c:(700,350),  e_grid_4_d:(750,350),
//   e_haul_1:(300,250),       e_haul_2:(400,250),       e_haul_3:(500,250),    e_hub:(600,250),
//   fuel_1:(700,630),         fuel_2:(700,670),
//   fw_haul_1:(-50,250),      fw_haul_2:(-150,250),     fw_haul_3:(-250,250),  fw_hub:(-350,250),
//   fw_load_spur_1:(-470,150),fw_load_spur_2:(-500,270),fw_load_spur_3:(-450,370),fw_load_spur_4:(-300,320),
//   fw_load_spur_5:(-520,100),fw_load_spur_6:(-550,270),fw_load_spur_7:(-500,420),fw_load_spur_8:(-250,370),
//   fw_load_spur_9:(-570,50), fw_load_spur_10:(-600,270),fw_load_spur_11:(-550,470),fw_load_spur_12:(-200,420),
//   fw_pit_1_a:(-350,150),fw_pit_1_b:(-450,150),fw_pit_1_c:(-500,250),fw_pit_1_d:(-450,350),
//   fw_pit_1_e:(-350,350),fw_pit_1_f:(-300,300),fw_pit_1_g:(-300,200),
//   fw_pit_2_a:(-350,100),fw_pit_2_b:(-500,100),fw_pit_2_c:(-550,250),fw_pit_2_d:(-500,400),
//   fw_pit_2_e:(-350,400),fw_pit_2_f:(-250,350),fw_pit_2_g:(-250,150),
//   fw_pit_3_a:(-350,50), fw_pit_3_b:(-550,50), fw_pit_3_c:(-600,250),fw_pit_3_d:(-550,450),
//   fw_pit_3_e:(-350,450),fw_pit_3_f:(-200,400),fw_pit_3_g:(-200,100),
//   ix_east_1:(180,250),ix_east_2:(200,250),
//   ix_north_1:(150,220),ix_north_2:(150,200),
//   ix_west_1:(120,250),ix_west_2:(100,250),
//   load_hub_1a:(120,200),load_hub_1b:(100,200),load_hub_2a:(180,200),load_hub_2b:(200,200),
//   load_spur_1a_1:(90,190),load_spur_1a_2:(80,180),load_spur_1b_1:(110,190),load_spur_1b_2:(120,180),
//   load_spur_2a_1:(190,170),load_spur_2a_2:(180,150),load_spur_2b_1:(210,170),load_spur_2b_2:(220,150),
//   load_zone_1:(80,160),  load_zone_2:(120,160),  load_zone_3:(200,120),
//   load_zone_4:(-490,150),load_zone_5:(-500,290),load_zone_6:(-450,390),load_zone_7:(-300,340),
//   load_zone_8:(-540,100),load_zone_9:(-550,290),load_zone_10:(-500,440),load_zone_11:(-250,390),
//   load_zone_12:(-590,50),load_zone_13:(-600,290),load_zone_14:(-550,490),load_zone_15:(-200,440),
//   load_zone_16:(50,-290),load_zone_17:(150,-340),load_zone_18:(250,-290),
//   load_zone_19:(0,-290),  load_zone_20:(150,-390),load_zone_21:(300,-290),
//   load_zone_22:(-170,400),load_zone_23:(-100,330),
//   load_zone_24:(500,-190),load_zone_25:(600,-240),load_zone_26:(700,-190),
//   load_zone_27:(450,-190),load_zone_28:(600,-290),load_zone_29:(750,-190),
//   main_hub:(150,250),
//   n_haul_1:(150,100),n_haul_2:(150,0),n_haul_3:(150,-100),n_hub:(150,-200),
//   n_load_spur_1:(50,-270),n_load_spur_2:(150,-320),n_load_spur_3:(250,-270),
//   n_load_spur_4:(0,-270),n_load_spur_5:(150,-370),n_load_spur_6:(300,-270),
//   n_q_1_a:(100,-200),n_q_1_b:(50,-250),n_q_1_c:(100,-300),n_q_1_d:(200,-300),n_q_1_e:(250,-250),n_q_1_f:(200,-200),
//   n_q_2_a:(50,-200), n_q_2_b:(0,-250),  n_q_2_c:(50,-350), n_q_2_d:(250,-350),n_q_2_e:(300,-250),n_q_2_f:(250,-200),
//   ne_haul_1:(600,100),ne_haul_2:(600,0),ne_hub:(600,-100),
//   ne_load_spur_1:(500,-170),ne_load_spur_2:(600,-220),ne_load_spur_3:(700,-170),
//   ne_load_spur_4:(450,-170),ne_load_spur_5:(600,-290),ne_load_spur_6:(750,-170),
//   ne_q_1_a:(550,-100),ne_q_1_b:(500,-150),ne_q_1_c:(550,-200),ne_q_1_d:(650,-200),ne_q_1_e:(700,-150),ne_q_1_f:(650,-100),
//   ne_q_2_a:(500,-100),ne_q_2_b:(450,-150),ne_q_2_c:(500,-250),ne_q_2_d:(700,-250),ne_q_2_e:(750,-150),ne_q_2_f:(700,-100),
//   parking_1:(500,630),parking_2:(500,670),
//   purple_auto_fix_1:(80,166.7),purple_auto_fix_2:(-200,250),purple_auto_fix_3:(-300,250),
//   s_connector_1:(0,550),s_connector_2:(-50,450),
//   s_dump_spur_1:(50,720),s_dump_spur_2:(150,770),s_dump_spur_3:(250,720),
//   s_dump_spur_4:(-50,720),s_dump_spur_5:(50,820),s_dump_spur_6:(250,820),s_dump_spur_7:(350,720),
//   s_haul_1:(150,350),s_haul_2:(150,450),s_haul_3:(150,550),s_hub:(150,650),
//   s_sp_1_a:(100,650),s_sp_1_b:(50,700),s_sp_1_c:(100,750),s_sp_1_d:(200,750),s_sp_1_e:(250,700),s_sp_1_f:(200,650),
//   s_sp_2_a:(0,650),s_sp_2_b:(-50,700),s_sp_2_c:(0,750),s_sp_2_d:(100,800),s_sp_2_e:(200,800),
//   s_sp_2_f:(300,750),s_sp_2_g:(350,700),s_sp_2_h:(300,650),
//   service_exit_1:(150,280),service_exit_2:(160,270),
//   service_haul_1:(600,400),service_haul_2:(600,500),service_hub:(600,600),
//   service_loop_1:(550,600),service_loop_2:(500,650),service_loop_3:(550,700),
//   service_loop_4:(650,700),service_loop_5:(700,650),service_loop_6:(650,600),
//   start_zone:(150,300),
//   sw_connector_1:(-100,400),sw_connector_2:(-50,350),
//   sw_dump_spur_1:(-150,450),sw_dump_spur_2:(-100,500),sw_dump_spur_3:(-50,450),
//   sw_haul_1:(100,300),sw_haul_2:(50,350),sw_haul_3:(0,400),sw_hub:(-100,450),
//   sw_load_spur_1:(-150,400),sw_load_spur_2:(-100,350),
// };

// // ── Centroid offset so world center = (0,0) ────────────────────────
// // X: -600 to 750 → center 75   |   Y: -390 to 840 → center 225
// const OX = 75;
// const OY = 225;

// // ── Terrain height function (matches Python _get_z) ────────────────
// // Pit centers (approx, from Python _pit_centers logic)
// const PIT_CENTERS = [
//   { x: -425, y: 250 }, // fw pits centroid
//   { x:  150, y: -275 }, // n  pits centroid
//   { x:  600, y: -175 }, // ne pits centroid
//   { x:  150, y:  700 }, // s  pits centroid
// ];

// function getZ(rx, ry) {
//   let base = 0.02 * rx + 0.015 * ry
//            + 20 * Math.sin(rx / 200)
//            + 15 * Math.cos(ry / 150);
//   for (const { x: cx, y: cy } of PIT_CENTERS) {
//     const d = Math.hypot(rx - cx, ry - cy);
//     if (d < 220) base -= (220 - d) * 1.3;
//   }
//   return base;
// }

// // ── Build NODES: { name: {x, y, z} } in world-space (centered) ────
// export const NODES = {};
// for (const [name, [rx, ry]] of Object.entries(_RAW)) {
//   const x = rx - OX;
//   const y = ry - OY;
//   const z = getZ(rx, ry);
//   NODES[name] = { x, y: z * 0.04, z: y }; // map: raw-X→THREE-X, raw-Y→THREE-Z, Z→THREE-Y
//   // Scale terrain height down (×0.04) so it's subtle, not extreme
// }

// // ── Zone classification ──────────────────────────────────────────────
// export const LOAD_ZONES = new Set([
//   "load_zone_1","load_zone_2","load_zone_3","load_zone_4","load_zone_5",
//   "load_zone_6","load_zone_7","load_zone_8","load_zone_9","load_zone_10",
//   "load_zone_11","load_zone_12","load_zone_13","load_zone_14","load_zone_15",
//   "load_zone_16","load_zone_17","load_zone_18","load_zone_19","load_zone_20",
//   "load_zone_21","load_zone_22","load_zone_23","load_zone_24","load_zone_25",
//   "load_zone_26","load_zone_27","load_zone_28","load_zone_29",
// ]);

// export const DUMP_ZONES = new Set([
//   "dump_zone_1","dump_zone_2","dump_zone_3","dump_zone_4","dump_zone_5",
//   "dump_zone_6","dump_zone_7","dump_zone_8","dump_zone_9","dump_zone_10",
//   "dump_zone_11","dump_zone_12","dump_zone_13","dump_zone_14","dump_zone_15",
//   "dump_zone_16","dump_zone_17","dump_zone_18","dump_zone_19","dump_zone_20",
//   "dump_zone_21","dump_zone_22","dump_zone_23","dump_zone_24",
//   "parking_1","parking_2",
// ]);

// export const FUEL_ZONES  = new Set(["fuel_1","fuel_2"]);
// export const HUB_NODES   = new Set(["main_hub","n_hub","ne_hub","s_hub","e_hub","fw_hub","sw_hub","service_hub"]);
// export const START_NODES = new Set(["start_zone"]);

// // ── Edges ────────────────────────────────────────────────────────────
// export const EDGES = [
//   ["connector_1_1","connector_1_2"],["connector_1_1","n_haul_1"],
//   ["connector_1_2","connector_1_3"],["connector_1_3","purple_auto_fix_1"],
//   ["connector_2_2","connector_2_3"],["connector_2_2","e_haul_1"],
//   ["connector_2_2","ix_east_2"],["connector_2_3","dump_zone_2"],
//   ["dump_hub_1a","dump_hub_1b"],["dump_hub_1a","s_haul_1"],
//   ["dump_hub_1b","dump_spur_1a_1"],["dump_hub_1b","dump_spur_1b_1"],
//   ["dump_spur_1a_1","dump_spur_1a_2"],["dump_spur_1a_2","dump_zone_1"],
//   ["dump_spur_1b_1","dump_spur_1b_2"],["dump_spur_1b_2","dump_zone_2"],
//   ["e_connector_n","e_connector_s"],
//   ["e_grid_1_a","e_grid_1_b"],["e_grid_1_a","e_grid_2_a"],["e_grid_1_a","ne_haul_1"],
//   ["e_grid_1_b","dump_zone_3"],["e_grid_1_b","e_grid_1_c"],["e_grid_1_b","e_grid_2_b"],
//   ["e_grid_1_c","dump_zone_4"],["e_grid_1_c","e_grid_1_d"],["e_grid_1_c","e_grid_2_c"],
//   ["e_grid_1_d","dump_zone_5"],["e_grid_1_d","e_connector_n"],["e_grid_1_d","e_grid_2_d"],
//   ["e_grid_2_a","e_grid_2_b"],["e_grid_2_b","dump_zone_6"],["e_grid_2_b","e_grid_2_c"],
//   ["e_grid_2_c","dump_zone_7"],["e_grid_2_c","e_grid_2_d"],
//   ["e_grid_2_d","dump_zone_8"],["e_grid_2_d","e_connector_n"],
//   ["e_grid_3_a","e_grid_3_b"],["e_grid_3_a","e_grid_4_a"],
//   ["e_grid_3_b","dump_zone_9"],["e_grid_3_b","e_grid_3_c"],["e_grid_3_b","e_grid_4_b"],
//   ["e_grid_3_c","dump_zone_10"],["e_grid_3_c","e_grid_3_d"],["e_grid_3_c","e_grid_4_c"],
//   ["e_grid_3_d","dump_zone_11"],["e_grid_3_d","e_connector_s"],["e_grid_3_d","e_grid_4_d"],
//   ["e_grid_4_a","e_grid_4_b"],["e_grid_4_a","service_haul_1"],
//   ["e_grid_4_b","dump_zone_12"],["e_grid_4_b","e_grid_4_c"],
//   ["e_grid_4_c","dump_zone_13"],["e_grid_4_c","e_grid_4_d"],
//   ["e_grid_4_d","dump_zone_14"],["e_grid_4_d","e_connector_s"],
//   ["e_haul_1","e_haul_2"],["e_haul_2","e_haul_3"],["e_haul_3","e_hub"],
//   ["e_hub","e_grid_1_a"],["e_hub","e_grid_3_a"],
//   ["fw_haul_1","fw_haul_2"],["fw_haul_2","purple_auto_fix_2"],
//   ["fw_haul_3","purple_auto_fix_2"],["fw_haul_3","purple_auto_fix_3"],
//   ["fw_hub","fw_pit_1_a"],["fw_hub","purple_auto_fix_3"],
//   ["fw_load_spur_1","load_zone_4"],["fw_load_spur_2","load_zone_5"],
//   ["fw_load_spur_3","load_zone_6"],["fw_load_spur_4","load_zone_7"],
//   ["fw_load_spur_5","load_zone_8"],["fw_load_spur_6","load_zone_9"],
//   ["fw_load_spur_7","load_zone_10"],["fw_load_spur_8","load_zone_11"],
//   ["fw_load_spur_9","load_zone_12"],["fw_load_spur_10","load_zone_13"],
//   ["fw_load_spur_11","load_zone_14"],["fw_load_spur_12","load_zone_15"],
//   ["fw_pit_1_a","fw_pit_1_b"],["fw_pit_1_a","fw_pit_2_a"],
//   ["fw_pit_1_b","fw_load_spur_1"],["fw_pit_1_b","fw_pit_1_c"],
//   ["fw_pit_1_c","fw_load_spur_2"],["fw_pit_1_c","fw_pit_1_d"],
//   ["fw_pit_1_d","fw_load_spur_3"],["fw_pit_1_d","fw_pit_1_e"],
//   ["fw_pit_1_e","fw_pit_1_f"],["fw_pit_1_e","fw_pit_2_e"],
//   ["fw_pit_1_f","fw_load_spur_4"],["fw_pit_1_f","purple_auto_fix_3"],
//   ["fw_pit_1_g","fw_pit_1_a"],["fw_pit_1_g","fw_pit_2_g"],["fw_pit_1_g","purple_auto_fix_3"],
//   ["fw_pit_2_a","fw_pit_2_b"],["fw_pit_2_a","fw_pit_3_a"],
//   ["fw_pit_2_b","fw_load_spur_5"],["fw_pit_2_b","fw_pit_2_c"],
//   ["fw_pit_2_c","fw_load_spur_6"],["fw_pit_2_c","fw_pit_2_d"],
//   ["fw_pit_2_d","fw_load_spur_7"],["fw_pit_2_d","fw_pit_2_e"],
//   ["fw_pit_2_e","fw_pit_2_f"],["fw_pit_2_e","fw_pit_3_e"],
//   ["fw_pit_2_f","fw_load_spur_8"],["fw_pit_2_f","fw_pit_2_g"],
//   ["fw_pit_2_g","fw_pit_2_a"],["fw_pit_2_g","fw_pit_3_g"],
//   ["fw_pit_3_a","fw_pit_3_b"],["fw_pit_3_b","fw_load_spur_9"],["fw_pit_3_b","fw_pit_3_c"],
//   ["fw_pit_3_c","fw_load_spur_10"],["fw_pit_3_c","fw_pit_3_d"],
//   ["fw_pit_3_d","fw_load_spur_11"],["fw_pit_3_d","fw_pit_3_e"],
//   ["fw_pit_3_e","fw_pit_3_f"],["fw_pit_3_f","fw_load_spur_12"],["fw_pit_3_f","purple_auto_fix_2"],
//   ["fw_pit_3_g","fw_pit_3_a"],["fw_pit_3_g","purple_auto_fix_2"],
//   ["ix_east_1","ix_east_2"],["ix_east_2","dump_hub_1b"],
//   ["ix_east_2","e_haul_1"],["ix_east_2","load_hub_2b"],
//   ["ix_north_1","ix_north_2"],
//   ["ix_north_2","load_hub_1a"],["ix_north_2","load_hub_2a"],["ix_north_2","n_haul_1"],
//   ["ix_west_1","ix_west_2"],["ix_west_2","connector_1_3"],
//   ["ix_west_2","fw_haul_1"],["ix_west_2","load_hub_1b"],
//   ["load_hub_1a","load_hub_1b"],
//   ["load_hub_1b","load_spur_1a_1"],["load_hub_1b","load_spur_1b_1"],["load_hub_1b","purple_auto_fix_1"],
//   ["load_hub_2a","load_hub_2b"],
//   ["load_hub_2b","load_spur_2a_1"],["load_hub_2b","load_spur_2b_1"],
//   ["load_spur_1a_1","load_spur_1a_2"],["load_spur_1a_2","purple_auto_fix_1"],
//   ["load_spur_1b_1","load_spur_1b_2"],["load_spur_1b_2","load_zone_2"],
//   ["load_spur_2a_1","load_spur_2a_2"],["load_spur_2a_2","load_zone_3"],
//   ["load_spur_2b_1","load_spur_2b_2"],["load_spur_2b_2","load_zone_3"],
//   ["load_zone_1","purple_auto_fix_1"],["load_zone_3","connector_1_1"],
//   ["main_hub","dump_hub_1a"],["main_hub","ix_east_1"],["main_hub","ix_north_1"],
//   ["main_hub","ix_west_1"],["main_hub","sw_haul_1"],
//   ["n_haul_1","n_haul_2"],["n_haul_2","n_haul_3"],["n_haul_3","n_hub"],
//   ["n_hub","n_q_1_a"],
//   ["n_load_spur_1","load_zone_16"],["n_load_spur_2","load_zone_17"],
//   ["n_load_spur_3","load_zone_18"],["n_load_spur_4","load_zone_19"],
//   ["n_load_spur_5","load_zone_20"],["n_load_spur_6","load_zone_21"],
//   ["n_q_1_a","n_q_1_b"],["n_q_1_a","n_q_2_a"],
//   ["n_q_1_b","n_load_spur_1"],["n_q_1_b","n_q_1_c"],
//   ["n_q_1_c","n_load_spur_2"],["n_q_1_c","n_q_1_d"],
//   ["n_q_1_d","n_q_1_e"],["n_q_1_e","n_load_spur_3"],["n_q_1_e","n_q_1_f"],
//   ["n_q_1_f","n_hub"],
//   ["n_q_2_a","n_q_2_b"],["n_q_2_b","n_load_spur_4"],["n_q_2_b","n_q_2_c"],
//   ["n_q_2_c","n_load_spur_5"],["n_q_2_c","n_q_2_d"],
//   ["n_q_2_d","n_q_2_e"],["n_q_2_e","n_load_spur_6"],["n_q_2_e","n_q_2_f"],
//   ["n_q_2_f","n_q_1_f"],
//   ["ne_haul_1","ne_haul_2"],["ne_haul_2","ne_hub"],["ne_hub","ne_q_1_a"],
//   ["ne_load_spur_1","load_zone_24"],["ne_load_spur_2","load_zone_25"],
//   ["ne_load_spur_3","load_zone_26"],["ne_load_spur_4","load_zone_27"],
//   ["ne_load_spur_5","load_zone_28"],["ne_load_spur_6","load_zone_29"],
//   ["ne_q_1_a","ne_q_1_b"],["ne_q_1_a","ne_q_2_a"],
//   ["ne_q_1_b","ne_load_spur_1"],["ne_q_1_b","ne_q_1_c"],
//   ["ne_q_1_c","ne_load_spur_2"],["ne_q_1_c","ne_q_1_d"],
//   ["ne_q_1_d","ne_q_1_e"],["ne_q_1_e","ne_load_spur_3"],["ne_q_1_e","ne_q_1_f"],
//   ["ne_q_1_f","ne_hub"],
//   ["ne_q_2_a","ne_q_2_b"],["ne_q_2_b","ne_load_spur_4"],["ne_q_2_b","ne_q_2_c"],
//   ["ne_q_2_c","ne_load_spur_5"],["ne_q_2_c","ne_q_2_d"],
//   ["ne_q_2_d","ne_q_2_e"],["ne_q_2_e","ne_load_spur_6"],["ne_q_2_e","ne_q_2_f"],
//   ["ne_q_2_f","ne_q_1_f"],
//   ["s_connector_1","s_connector_2"],["s_connector_2","sw_hub"],
//   ["s_dump_spur_1","dump_zone_15"],["s_dump_spur_2","dump_zone_16"],
//   ["s_dump_spur_3","dump_zone_17"],["s_dump_spur_4","dump_zone_18"],
//   ["s_dump_spur_5","dump_zone_19"],["s_dump_spur_6","dump_zone_20"],
//   ["s_dump_spur_7","dump_zone_21"],
//   ["s_haul_1","s_haul_2"],["s_haul_2","s_haul_3"],
//   ["s_haul_3","s_connector_1"],["s_haul_3","s_hub"],
//   ["s_hub","s_sp_1_a"],
//   ["s_sp_1_a","s_sp_1_b"],["s_sp_1_a","s_sp_2_a"],
//   ["s_sp_1_b","s_dump_spur_1"],["s_sp_1_b","s_sp_1_c"],
//   ["s_sp_1_c","s_dump_spur_2"],["s_sp_1_c","s_sp_1_d"],
//   ["s_sp_1_d","s_sp_1_e"],["s_sp_1_e","s_dump_spur_3"],["s_sp_1_e","s_sp_1_f"],
//   ["s_sp_1_f","s_hub"],
//   ["s_sp_2_a","s_sp_2_b"],["s_sp_2_b","s_dump_spur_4"],["s_sp_2_b","s_sp_2_c"],
//   ["s_sp_2_c","s_sp_2_d"],["s_sp_2_d","s_dump_spur_5"],["s_sp_2_d","s_sp_2_e"],
//   ["s_sp_2_e","s_dump_spur_6"],["s_sp_2_e","s_sp_2_f"],
//   ["s_sp_2_f","s_sp_2_g"],["s_sp_2_g","s_dump_spur_7"],["s_sp_2_g","s_sp_2_h"],
//   ["s_sp_2_h","s_sp_1_f"],
//   ["service_exit_1","service_exit_2"],["service_exit_2","main_hub"],
//   ["service_haul_1","service_haul_2"],["service_haul_2","service_hub"],
//   ["service_hub","service_loop_1"],["service_hub","service_loop_6"],
//   ["service_loop_1","service_loop_2"],
//   ["service_loop_2","parking_1"],["service_loop_2","parking_2"],
//   ["service_loop_2","service_loop_3"],["service_loop_3","service_loop_4"],
//   ["service_loop_5","fuel_1"],["service_loop_5","fuel_2"],
//   ["service_loop_5","service_loop_4"],["service_loop_6","service_loop_5"],
//   ["start_zone","service_exit_1"],
//   ["sw_connector_1","sw_haul_3"],["sw_connector_2","sw_haul_3"],
//   ["sw_dump_spur_1","dump_zone_22"],["sw_dump_spur_2","dump_zone_23"],
//   ["sw_dump_spur_3","dump_zone_24"],
//   ["sw_haul_1","sw_haul_2"],["sw_haul_2","sw_haul_3"],["sw_haul_3","sw_hub"],
//   ["sw_hub","sw_dump_spur_1"],["sw_hub","sw_dump_spur_2"],["sw_hub","sw_dump_spur_3"],
//   ["sw_hub","sw_load_spur_1"],["sw_hub","sw_load_spur_2"],
//   ["sw_load_spur_1","load_zone_22"],["sw_load_spur_2","load_zone_23"],
//   ["connector_2_2","ix_east_2"],["ix_north_2","connector_1_1"],
// ].filter(([a, b]) => NODES[a] && NODES[b]);

// // ── Build road graph for truck pathfinding ───────────────────────────
// export const ROAD_GRAPH = {};
// for (const name of Object.keys(NODES)) ROAD_GRAPH[name] = [];
// for (const [a, b] of EDGES) {
//   const na = NODES[a], nb = NODES[b];
//   const d = Math.hypot(na.x - nb.x, na.z - nb.z);
//   ROAD_GRAPH[a].push({ node: b, dist: d });
//   ROAD_GRAPH[b].push({ node: a, dist: d });
// }

// // ── Dijkstra for truck route planning ──────────────────────────────
// export function findPath(from, to) {
//   const dist  = {}, prev  = {}, visited = new Set();
//   for (const n of Object.keys(NODES)) dist[n] = Infinity;
//   dist[from] = 0;
//   const queue = [{ node: from, d: 0 }];

//   while (queue.length) {
//     queue.sort((a, b) => a.d - b.d);
//     const { node: cur } = queue.shift();
//     if (visited.has(cur)) continue;
//     visited.add(cur);
//     if (cur === to) break;
//     for (const { node: nb, dist: w } of (ROAD_GRAPH[cur] ?? [])) {
//       const nd = dist[cur] + w;
//       if (nd < dist[nb]) { dist[nb] = nd; prev[nb] = cur; queue.push({ node: nb, d: nd }); }
//     }
//   }
//   // Reconstruct path
//   const path = [];
//   let cur = to;
//   while (cur) { path.unshift(cur); cur = prev[cur]; }
//   return path[0] === from ? path : null;
// }

// // ── Truck starting assignments ────────────────────────────────────
// // Spread trucks across all load zones, each going to nearest dump zone
// const LOAD_ZONE_LIST = [...LOAD_ZONES];
// const DUMP_ZONE_LIST = [...DUMP_ZONES].filter(n => NODES[n]);

// export function getTruckRoutes(count = 20) {
//   return Array.from({ length: count }, (_, i) => {
//     const loadZone = LOAD_ZONE_LIST[i % LOAD_ZONE_LIST.length];
//     // Pick nearest dump zone
//     const ln = NODES[loadZone];
//     let bestDump = DUMP_ZONE_LIST[0], bestDist = Infinity;
//     for (const dz of DUMP_ZONE_LIST) {
//       const dn = NODES[dz];
//       if (!dn) continue;
//       const d = Math.hypot(ln.x - dn.x, ln.z - dn.z);
//       if (d < bestDist) { bestDist = d; bestDump = dz; }
//     }
//     return { id: `TRK${String(i+1).padStart(3,"0")}`, loadZone, dumpZone: bestDump };
//   });
// }

// // ── World bounds (for camera framing) ────────────────────────────
// export const WORLD_BOUNDS = {
//   minX: -600 - OX, maxX: 750 - OX,
//   minZ: -390 - OY, maxZ: 840 - OY,
//   centerX: 0, centerZ: 0,
//   spanX: 1350, spanZ: 1230,
// };