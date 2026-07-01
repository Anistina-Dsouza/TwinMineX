import { useEffect, useState, useRef } from "react";

export default function RemoteConsole() {
  const [ws, setWs] = useState(null);
  const [connected, setConnected] = useState(false);
  const [deviceSensorsActive, setDeviceSensorsActive] = useState(false);
  
  // Selection states
  const [activeTab, setActiveTab] = useState("trucks"); // "trucks" | "towers"
  const [selectedId, setSelectedId] = useState(null);

  // Calibration baseline
  const baselineRef = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const lastSentRef = useRef(0);

  // List of trucks and towers (mocked IDs for remote triggers)
  const trucksList = Array.from({ length: 20 }, (_, i) => `TRK${String(i + 1).padStart(3, "0")}`);
  const towersList = ["TWR001", "TWR002", "TWR003", "TWR004"];

  // Establish WebSocket connection to backend broker (port 5001)
  useEffect(() => {
    const brokerUrl = `ws://${window.location.hostname}:5001`;
    const socket = new WebSocket(brokerUrl);

    socket.onopen = () => {
      console.log("Connected to Remote Broker");
      // Register role
      socket.send(JSON.stringify({ type: "register", clientType: "remote" }));
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "status" && msg.connected) {
          setConnected(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    socket.onclose = () => {
      setConnected(false);
      console.log("Disconnected from Remote Broker");
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  // Listen to orientation sensors
  useEffect(() => {
    if (!deviceSensorsActive) return;

    const handleOrientation = (e) => {
      const now = Date.now();
      // Throttling sends to 20Hz (every 50ms) to save bandwidth
      if (now - lastSentRef.current < 50) return;
      lastSentRef.current = now;

      // Extract rotation offsets from baseline
      const da = (e.alpha - baselineRef.current.alpha + 360) % 360;
      const db = e.beta - baselineRef.current.beta;
      const dg = e.gamma - baselineRef.current.gamma;

      // Normalize delta angles (-180 to 180)
      const normDa = da > 180 ? da - 360 : da;

      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: "camera:rotate",
          alpha: normDa,
          beta: db,
          gamma: dg
        }));
      }
    };

    window.addEventListener("deviceorientation", handleOrientation);
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [deviceSensorsActive, ws]);

  const calibrateSensors = () => {
    // Request iOS permissions if needed
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response === "granted") {
            setDeviceSensorsActive(true);
          }
        })
        .catch(console.error);
    } else {
      setDeviceSensorsActive(true);
    }

    // Set current orientation as neutral baseline
    const tempListener = (e) => {
      baselineRef.current = {
        alpha: e.alpha || 0,
        beta: e.beta || 0,
        gamma: e.gamma || 0
      };
      window.removeEventListener("deviceorientation", tempListener);
    };
    window.addEventListener("deviceorientation", tempListener);
  };

  // Helper helper to send key actions
  const sendCommand = (cmdType, payload = {}) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: cmdType, ...payload }));
    }
  };

  const handleSelect = (id) => {
    setSelectedId(id);
    sendCommand(activeTab === "trucks" ? "select:truck" : "select:tower", { id });
  };

  return (
    <div style={styles.container}>
      {/* Header Status Bar */}
      <header style={styles.header}>
        <div style={styles.brand}>TWINMINE X</div>
        <div style={styles.statusRow}>
          <span style={{
            ...styles.indicator,
            background: connected ? "var(--green)" : "var(--red)",
            boxShadow: connected ? "0 0 8px var(--green)" : "0 0 8px var(--red)",
          }}/>
          <span style={styles.statusText}>
            {connected ? "LIVE LINK ACTIVE" : "CONNECTING TO BROKER..."}
          </span>
        </div>
      </header>

      {/* Camera Controller Card */}
      <section style={styles.section}>
        <div style={styles.sectionTitle}>CAMERA NAVIGATION CONTROLS</div>
        
        {/* Virtual D-pad / Joystick Layout */}
        <div style={styles.dpadGrid}>
          <div/>
          <button 
            onTouchStart={() => sendCommand("camera:move", { direction: "forward" })}
            onTouchEnd={() => sendCommand("camera:move", { direction: "stop" })}
            style={styles.dpadButton}
          >
            ▲ ZOOM IN
          </button>
          <div/>

          <button 
            onTouchStart={() => sendCommand("camera:move", { direction: "left" })}
            onTouchEnd={() => sendCommand("camera:move", { direction: "stop" })}
            style={styles.dpadButton}
          >
            ◀ PAN LEFT
          </button>
          <button 
            onClick={calibrateSensors}
            style={{...styles.dpadButton, ...styles.sensorButton, background: deviceSensorsActive ? "rgba(0, 210, 200, 0.2)" : undefined}}
          >
            {deviceSensorsActive ? "🎯 GYRO CALIB" : "🔌 ENABLE GYRO"}
          </button>
          <button 
            onTouchStart={() => sendCommand("camera:move", { direction: "right" })}
            onTouchEnd={() => sendCommand("camera:move", { direction: "stop" })}
            style={styles.dpadButton}
          >
            PAN RIGHT ▶
          </button>

          <button 
            onTouchStart={() => sendCommand("camera:move", { direction: "down" })}
            onTouchEnd={() => sendCommand("camera:move", { direction: "stop" })}
            style={styles.dpadButton}
          >
            ▼ GO DOWN
          </button>
          <button 
            onTouchStart={() => sendCommand("camera:move", { direction: "backward" })}
            onTouchEnd={() => sendCommand("camera:move", { direction: "stop" })}
            style={styles.dpadButton}
          >
            ▼ ZOOM OUT
          </button>
          <button 
            onTouchStart={() => sendCommand("camera:move", { direction: "up" })}
            onTouchEnd={() => sendCommand("camera:move", { direction: "stop" })}
            style={styles.dpadButton}
          >
            ▲ GO UP
          </button>
        </div>
      </section>

      {/* Tab Selectors */}
      <div style={styles.tabsRow}>
        <button 
          onClick={() => { setActiveTab("trucks"); setSelectedId(null); }}
          style={{...styles.tabButton, borderBottom: activeTab === "trucks" ? "2px solid var(--amber)" : "none", color: activeTab === "trucks" ? "var(--amber)" : "#888"}}
        >
          🚛 FLEET ({trucksList.length})
        </button>
        <button 
          onClick={() => { setActiveTab("towers"); setSelectedId(null); }}
          style={{...styles.tabButton, borderBottom: activeTab === "towers" ? "2px solid var(--blue)" : "none", color: activeTab === "towers" ? "var(--blue)" : "#888"}}
        >
          📡 TOWERS ({towersList.length})
        </button>
      </div>

      {/* Grid Selection List */}
      <section style={{...styles.section, flex: 1, overflowY: "auto"}}>
        <div style={styles.grid}>
          {(activeTab === "trucks" ? trucksList : towersList).map((id) => (
            <button
              key={id}
              onClick={() => handleSelect(id)}
              style={{
                ...styles.gridItem,
                borderColor: selectedId === id 
                  ? (activeTab === "trucks" ? "var(--amber)" : "var(--blue)")
                  : "var(--border)",
                background: selectedId === id
                  ? (activeTab === "trucks" ? "rgba(255, 170, 0, 0.15)" : "rgba(68, 136, 255, 0.15)")
                  : "rgba(10, 18, 30, 0.6)",
              }}
            >
              {id}
            </button>
          ))}
        </div>
      </section>

      {/* Control Actions / Dashboard Operations */}
      <section style={styles.actionsFooter}>
        {selectedId ? (
          <div style={styles.buttonRow}>
            {activeTab === "trucks" ? (
              <>
                <button 
                  onClick={() => sendCommand("action:truck", { action: "stop", id: selectedId })}
                  style={{...styles.actionBtn, background: "var(--red)"}}
                >
                  🛑 STOP TRUCK
                </button>
                <button 
                  onClick={() => sendCommand("action:truck", { action: "auto", id: selectedId })}
                  style={{...styles.actionBtn, background: "var(--green)"}}
                >
                  ⚡ AUTO PILOT
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => sendCommand("action:tower", { action: "togglePower", id: selectedId })}
                  style={{...styles.actionBtn, background: "var(--blue)"}}
                >
                  🔌 TOGGLE POWER
                </button>
                <button 
                  onClick={() => sendCommand("action:tower", { action: "recharge", id: selectedId })}
                  style={{...styles.actionBtn, background: "var(--amber)"}}
                >
                  🔋 RECHARGE
                </button>
              </>
            )}
          </div>
        ) : (
          <div style={styles.buttonRow}>
            <button 
              onClick={() => sendCommand("ui:toggleCharts")}
              style={{...styles.actionBtn, background: "rgba(0, 210, 200, 0.2)", border: "1px solid var(--cyan)"}}
            >
              📊 TOGGLE CHARTS MODAL
            </button>
            <button 
              onClick={() => sendCommand("ui:toggleHeatmap")}
              style={{...styles.actionBtn, background: "rgba(255, 170, 0, 0.2)", border: "1px solid var(--amber)"}}
            >
              🌡 TOGGLE HEATMAP
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#080e18",
    color: "#fff",
    fontFamily: "Outfit, Inter, sans-serif",
    overflow: "hidden",
  },
  header: {
    padding: "16px",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(10, 18, 30, 0.9)",
  },
  brand: {
    fontSize: "14px",
    fontWeight: "bold",
    letterSpacing: "0.15em",
    color: "var(--cyan)",
  },
  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  indicator: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
  statusText: {
    fontSize: "9px",
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.08em",
  },
  section: {
    padding: "12px 16px",
  },
  sectionTitle: {
    fontSize: "9px",
    fontFamily: "var(--font-mono)",
    color: "var(--text-secondary)",
    letterSpacing: "0.12em",
    marginBottom: "10px",
  },
  dpadGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "10px",
  },
  dpadButton: {
    background: "rgba(20, 30, 50, 0.8)",
    border: "1px solid var(--border)",
    color: "#fff",
    borderRadius: "8px",
    padding: "14px 8px",
    fontSize: "11px",
    fontFamily: "var(--font-mono)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    outline: "none",
  },
  sensorButton: {
    border: "1px solid var(--cyan)",
    color: "var(--cyan)",
    fontWeight: "bold",
  },
  tabsRow: {
    display: "flex",
    borderBottom: "1px solid var(--border)",
    background: "rgba(10, 18, 30, 0.4)",
  },
  tabButton: {
    flex: 1,
    padding: "14px",
    background: "transparent",
    border: "none",
    fontSize: "11px",
    fontFamily: "var(--font-mono)",
    fontWeight: "bold",
    cursor: "pointer",
    outline: "none",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "8px",
  },
  gridItem: {
    border: "1px solid var(--border)",
    borderRadius: "6px",
    padding: "12px 4px",
    fontSize: "10px",
    fontFamily: "var(--font-mono)",
    color: "#fff",
    cursor: "pointer",
    outline: "none",
    textAlign: "center",
  },
  actionsFooter: {
    padding: "16px",
    background: "rgba(10, 18, 30, 0.9)",
    borderTop: "1px solid var(--border)",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
  },
  actionBtn: {
    flex: 1,
    border: "none",
    borderRadius: "8px",
    padding: "15px",
    color: "#fff",
    fontSize: "11px",
    fontFamily: "var(--font-mono)",
    fontWeight: "bold",
    cursor: "pointer",
    outline: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }
};
