import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { createScene } from "./MineScene";
import TopBar            from "./components/TopBar";
import Sidebar           from "./components/Sidebar";
import StatusBar         from "./components/StatusBar";
import EnvironmentPanel  from "./components/EnvironmentPanel";
import InfoPanel         from "./components/InfoPanel";
import LiveChartsModal   from "./components/LiveChartsModal";
import { generateAlerts } from "./components/AlertSystem";

export default function App() {
  const mountRef  = useRef();
  const sceneRef  = useRef();

  const [trucks,  setTrucks]  = useState([]);
  const [towers,  setTowers]  = useState([]);

  // Selection
  const [selectedType,    setSelectedType]    = useState(null);
  const [selectedData,    setSelectedData]    = useState(null);
  const [selectedTruckId, setSelectedTruckId] = useState(null);
  const [selectedTowerId, setSelectedTowerId] = useState(null);

  // Feature state
  const [heatmapActive,  setHeatmapActive]  = useState(false);
  const [chartsOpen,     setChartsOpen]     = useState(false);
  const [alerts,         setAlerts]         = useState([]);

  // Generate alerts whenever truck data changes
  useEffect(() => {
    if (trucks.length > 0) setAlerts(generateAlerts(trucks));
  }, [trucks]);

  // Update telemetry dynamically every 2 seconds to make the digital twin dynamic and real-time
  useEffect(() => {
    if (trucks.length === 0) return;
    const interval = setInterval(() => {
      setTrucks(prevTrucks => {
        const updated = prevTrucks.map(t => {
          // Slow fuel decay
          let newFuel = t.fuel - (Math.random() > 0.7 ? 1 : 0);
          if (newFuel <= 5) newFuel = 100; // refuel when empty

          // Signal strength fluctuations
          let newSignal = t.signal + (Math.random() > 0.5 ? 2 : -2);
          newSignal = Math.max(30, Math.min(100, newSignal));

          // Battery fluctuations
          let newBattery = t.battery + (Math.random() > 0.5 ? 1 : -1);
          newBattery = Math.max(50, Math.min(100, newBattery));

          // Speed fluctuations
          let newSpeed = (t.speed ?? 30) + Math.floor(Math.random() * 5) - 2;
          newSpeed = Math.max(10, Math.min(50, newSpeed));

          // Latency fluctuations
          let newLatency = (t.latency ?? 15) + Math.floor(Math.random() * 3) - 1;
          newLatency = Math.max(5, Math.min(40, newLatency));

          return {
            ...t,
            fuel: newFuel,
            signal: newSignal,
            battery: newBattery,
            speed: newSpeed,
            latency: newLatency,
          };
        });

        // Sync to Three.js scene
        sceneRef.current?.updateTruckTelemetry?.(updated);

        return updated;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [trucks.length]);

  // Sync selectedData when trucks telemetry updates
  useEffect(() => {
    if (selectedType === "truck" && selectedTruckId) {
      const t = trucks.find(t => t._id === selectedTruckId);
      if (t) {
        setSelectedData({
          id: t._id, signal: t.signal, fuel: t.fuel,
          battery: t.battery, speed: t.speed ?? 30, latency: t.latency ?? 15,
        });
      }
    }
  }, [trucks, selectedType, selectedTruckId]);

  const clearSelection = useCallback(() => {
    setSelectedType(null); setSelectedData(null);
    setSelectedTruckId(null); setSelectedTowerId(null);
  }, []);

  const selectTruck = useCallback((id) => {
    const t = trucks.find(t => t._id === id);
    if (!t) return;
    setSelectedType("truck");
    setSelectedTruckId(id);
    setSelectedTowerId(null);
    setSelectedData({
      id: t._id, signal: t.signal, fuel: t.fuel,
      battery: t.battery, speed: t.speed ?? 30, latency: t.latency ?? 15,
    });
  }, [trucks]);

  const handleSceneTruckSelect = useCallback((truckObj) => {
    if (!truckObj) { clearSelection(); return; }
    setSelectedType("truck");
    setSelectedData(truckObj);
    setSelectedTruckId(truckObj.id);
    setSelectedTowerId(null);
  }, [clearSelection]);

  const handleTowerSelect = useCallback((id) => {
    const t = towers.find(t => t._id === id);
    if (!t) return;
    setSelectedType("tower");
    setSelectedTowerId(id);
    setSelectedTruckId(null);
    setSelectedData({ id: t._id, coverage: t.coverageRadius ?? 200, x: Math.round(t.x), z: Math.round(t.z) });
  }, [towers]);

  const handleHeatmapToggle = () => {
    if (!sceneRef.current) return;
    const nowVisible = sceneRef.current.toggleHeatmap();
    setHeatmapActive(nowVisible);
  };

  useEffect(() => {
    async function load() {
      try {
        const [tRes, rRes, trRes] = await Promise.all([
          axios.get("http://localhost:5000/towers"),
          axios.get("http://localhost:5000/routes"),
          axios.get("http://localhost:5000/trucks"),
        ]);
        const towersWithId = tRes.data.map((tw, i) => ({
          ...tw, _id: tw._id ?? `TWR${String(i+1).padStart(3,"0")}`,
        }));
        setTowers(towersWithId);
        setTrucks(trRes.data);

        requestAnimationFrame(() => {
          if (mountRef.current) {
            console.log("ROUTES FROM API:");
            console.log(rRes.data);
            sceneRef.current = createScene(
              mountRef.current,
              towersWithId,
              rRes.data,
              handleSceneTruckSelect,
            );
          }
        });
      } catch (e) {
        console.warn("Backend API offline, falling back to mock data:", e);
        const mockTowers = [
          { _id: "TWR001", x: 100, z: 100, coverageRadius: 300, status: "healthy" },
          { _id: "TWR002", x: 900, z: 100, coverageRadius: 300, status: "healthy" },
          { _id: "TWR003", x: 100, z: 900, coverageRadius: 300, status: "healthy" },
          { _id: "TWR004", x: 900, z: 900, coverageRadius: 300, status: "healthy" }
        ];
        const mockTrucks = Array.from({ length: 20 }, (_, i) => ({
          _id: `TRK${String(i + 1).padStart(3, "0")}`,
          name: `TRK${String(i + 1).padStart(3, "0")}`,
          fuel: Math.floor(Math.random() * 40) + 60,
          load: Math.floor(Math.random() * 100),
          speed: Math.floor(Math.random() * 25) + 20,
          signal: Math.floor(Math.random() * 30) + 70,
          latency: Math.floor(Math.random() * 20) + 10,
          battery: Math.floor(Math.random() * 20) + 80,
          status: "active"
        }));
        setTowers(mockTowers);
        setTrucks(mockTrucks);

        requestAnimationFrame(() => {
          if (mountRef.current) {
            sceneRef.current = createScene(
              mountRef.current,
              mockTowers,
              [],
              handleSceneTruckSelect,
            );
          }
        });
      }
    }
    load();
    return () => sceneRef.current?.cleanup?.();
  }, []);

  const criticalCount = alerts.filter(a => a.severity === "critical").length;

  return (
    <div style={{
      height:"100vh", display:"flex", flexDirection:"column",
      background:"var(--bg-root)", overflow:"hidden",
    }}>

      <TopBar
        truckCount={trucks.length}
        towerCount={towers.length}
        alerts={alerts}
        onAlertTruckSelect={selectTruck}
        onChartsOpen={() => setChartsOpen(true)}
        heatmapActive={heatmapActive}
        onHeatmapToggle={handleHeatmapToggle}
      />

      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

        <Sidebar
          trucks={trucks}
          towers={towers}
          selectedTruckId={selectedTruckId}
          selectedTowerId={selectedTowerId}
          onTruckSelect={selectTruck}
          onTowerSelect={handleTowerSelect}
        />

        <main style={{ flex:1, position:"relative", background:"var(--bg-scene)", overflow:"hidden" }}>
          <div ref={mountRef} style={{ width:"100%", height:"100%" }}/>

          {/* Corner brackets */}
          {["tl","tr","bl","br"].map(p => <Corner key={p} pos={p}/>)}

          {/* Heatmap legend (shown when active) */}
          {heatmapActive && <HeatmapLegend />}

          {/* Top-right panel */}
          <div style={{ position:"absolute", top:"14px", right:"14px", zIndex:20 }}>
            {selectedData
              ? <InfoPanel type={selectedType} data={selectedData} onClose={clearSelection}/>
              : <EnvironmentPanel />
            }
          </div>

          {/* Alert banner — slides in when criticals exist */}
          {criticalCount > 0 && !selectedData && (
            <div style={{
              position:"absolute", bottom:"14px", left:"50%",
              transform:"translateX(-50%)", zIndex:20,
              background:"rgba(255,69,96,0.12)",
              border:"1px solid rgba(255,69,96,0.4)",
              borderRadius:"6px", padding:"8px 16px",
              display:"flex", alignItems:"center", gap:"10px",
              animation:"fade-up 0.3s ease-out",
            }}>
              <span style={{
                width:"8px", height:"8px", borderRadius:"50%",
                background:"var(--red)", display:"inline-block",
                boxShadow:"0 0 8px var(--red)",
                animation:"pulse-dot 1s ease infinite",
              }}/>
              <span style={{
                fontFamily:"var(--font-mono)", fontSize:"10px",
                color:"var(--red)", letterSpacing:"0.12em",
              }}>
                {criticalCount} CRITICAL ALERT{criticalCount > 1 ? "S" : ""} — CHECK FLEET
              </span>
            </div>
          )}

          {/* Scene label */}
          <div style={{
            position:"absolute", bottom:"14px", left:"14px", zIndex:10,
            fontFamily:"var(--font-mono)", fontSize:"9px",
            color:"rgba(0,210,200,0.25)", letterSpacing:"0.16em",
            pointerEvents:"none",
          }}>
            MINE SITE · SECTOR A · LIVE
          </div>
        </main>
      </div>

      <StatusBar trucks={trucks} towers={towers}/>

      {/* Live Charts Modal */}
      <LiveChartsModal
        trucks={trucks}
        open={chartsOpen}
        onClose={() => setChartsOpen(false)}
      />

    </div>
  );
}

function Corner({ pos }) {
  const t = pos[0]==="t", l = pos[1]==="l";
  return (
    <div style={{
      position:"absolute",
      top:    t  ? "8px" : undefined, bottom: !t ? "8px" : undefined,
      left:   l  ? "8px" : undefined, right:  !l ? "8px" : undefined,
      width:"14px", height:"14px",
      borderTop:    t  ? "2px solid rgba(0,210,200,0.35)" : "none",
      borderBottom: !t ? "2px solid rgba(0,210,200,0.35)" : "none",
      borderLeft:   l  ? "2px solid rgba(0,210,200,0.35)" : "none",
      borderRight:  !l ? "2px solid rgba(0,210,200,0.35)" : "none",
      pointerEvents:"none",
    }}/>
  );
}

function HeatmapLegend() {
  return (
    <div style={{
      position:"absolute", bottom:"14px", right:"14px", zIndex:20,
      background:"rgba(10,18,32,0.9)",
      border:"1px solid var(--border)",
      borderRadius:"6px", padding:"8px 12px",
      animation:"fade-up 0.2s ease-out",
    }}>
      <div style={{ fontFamily:"var(--font-mono)", fontSize:"8px", color:"var(--amber)", letterSpacing:"0.18em", marginBottom:"7px" }}>
        🌡 SIGNAL HEATMAP
      </div>
      {[
        { color:"#00dc82", label:"Strong  ≥ 80%" },
        { color:"#f5a623", label:"Weak    55–79%" },
        { color:"#ff4560", label:"Critical < 55%" },
      ].map(({ color, label }) => (
        <div key={label} style={{ display:"flex", alignItems:"center", gap:"7px", marginBottom:"4px" }}>
          <div style={{
            width:"20px", height:"6px", borderRadius:"3px",
            background:`linear-gradient(90deg,${color},${color}80)`,
            boxShadow:`0 0 4px ${color}60`,
          }}/>
          <span style={{ fontFamily:"var(--font-mono)", fontSize:"9px", color:"var(--text-secondary)" }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
