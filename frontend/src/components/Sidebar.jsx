import { useState } from "react";

export default function Sidebar({ trucks, towers, selectedTruckId, selectedTowerId, onTruckSelect, onTowerSelect }) {
  const [fleetOpen,  setFleetOpen]  = useState(true);
  const [towersOpen, setTowersOpen] = useState(true);

  const avgSignal = trucks.length
    ? Math.round(trucks.reduce((s, t) => s + (t.signal ?? 0), 0) / trucks.length)
    : 0;

  const handleExport = () => {
    const csv = ["id,signal,fuel,battery,speed,latency",
      ...trucks.map(t => `${t._id},${t.signal},${t.fuel},${t.battery},${t.speed ?? ""},${t.latency ?? ""}`)
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "fleet_telemetry.csv";
    a.click();
  };

  return (
    <aside style={{
      width: "var(--sidebar-w)",
      height: "100%",
      background: "var(--bg-sidebar)",
      borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column",
      flexShrink: 0,
      animation: "slide-in 0.3s ease-out",
    }}>

      {/* ── Summary bar ── */}
      <div style={{
        padding: "12px 14px",
        borderBottom: "1px solid var(--border)",
        display: "flex", gap: "8px",
        flexShrink: 0,
      }}>
        <MiniStat label="TRUCKS"  value={trucks.length} />
        <MiniStat label="TOWERS"  value={towers.length} />
        <MiniStat label="AVG SIG" value={`${avgSignal}%`} color="var(--cyan)" />
      </div>

      {/* ── Scrollable content ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>

        {/* ── FLEET section ── */}
        <SectionHeader
          label="FLEET"
          count={trucks.length}
          open={fleetOpen}
          onToggle={() => setFleetOpen(o => !o)}
          onExport={handleExport}
        />

        {fleetOpen && trucks.map((truck, i) => {
          const sig  = truck.signal ?? 0;
          const fuel = truck.fuel   ?? 0;
          const isSelected = truck._id === selectedTruckId;
          let barColor = "var(--cyan)";
          if (sig < 80) barColor = "var(--amber)";
          if (sig < 50) barColor = "var(--red)";

          return (
            <div
              key={truck._id}
              onClick={() => onTruckSelect?.(truck._id)}
              style={{
                margin: "2px 8px",
                padding: "8px 10px",
                background: isSelected ? "rgba(0,210,200,0.08)" : "var(--bg-card)",
                border: `1px solid ${isSelected ? "var(--border-active)" : "var(--border)"}`,
                borderLeft: `3px solid ${barColor}`,
                borderRadius: "5px",
                cursor: "pointer",
                transition: "all 0.12s",
                animation: `fade-up 0.25s ease-out ${i * 0.012}s both`,
              }}
              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "var(--bg-card-hover)"; }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "var(--bg-card)"; }}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"5px" }}>
                <span style={{
                  fontFamily:"var(--font-mono)", fontSize:"11px",
                  color: isSelected ? "var(--cyan)" : "var(--text-primary)",
                  letterSpacing:"0.04em",
                }}>{truck._id}</span>
                <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                  <span style={{ fontFamily:"var(--font-mono)", fontSize:"9px", color:"var(--text-secondary)" }}>
                    ⛽{fuel}%
                  </span>
                  <span style={{ fontFamily:"var(--font-mono)", fontSize:"10px", color:barColor, fontWeight:600 }}>
                    {sig}%
                  </span>
                </div>
              </div>
              {/* Signal bar */}
              <div style={{ height:"2px", background:"rgba(255,255,255,0.05)", borderRadius:"1px" }}>
                <div style={{
                  width:`${sig}%`, height:"100%", background:barColor,
                  borderRadius:"1px", boxShadow:`0 0 4px ${barColor}60`,
                  transition:"width 0.5s ease",
                }}/>
              </div>
            </div>
          );
        })}

        {/* ── TOWERS section ── */}
        <SectionHeader
          label="TOWERS"
          count={towers.length}
          open={towersOpen}
          onToggle={() => setTowersOpen(o => !o)}
          style={{ marginTop: "6px" }}
        />

        {towersOpen && towers.map((tower, i) => {
          const isSelected = tower._id === selectedTowerId;
          const coverage = tower.coverageRadius ?? 0;
          const signalOk = tower.signal !== false;

          return (
            <div
              key={tower._id}
              onClick={() => onTowerSelect?.(tower._id)}
              style={{
                margin: "2px 8px",
                padding: "8px 10px",
                background: isSelected ? "rgba(0,210,200,0.08)" : "var(--bg-card)",
                border: `1px solid ${isSelected ? "var(--border-active)" : "var(--border)"}`,
                borderLeft: `3px solid ${isSelected ? "var(--cyan)" : "var(--green)"}`,
                borderRadius: "5px",
                cursor: "pointer",
                transition: "all 0.12s",
                animation: `fade-up 0.25s ease-out ${i * 0.06}s both`,
              }}
              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "var(--bg-card-hover)"; }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "var(--bg-card)"; }}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"4px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                  {/* Blinking beacon dot */}
                  <span style={{
                    width:"7px", height:"7px", borderRadius:"50%",
                    background:"var(--green)", display:"inline-block",
                    boxShadow:"0 0 6px var(--green)",
                    animation:"tower-blink 2s ease-in-out infinite",
                    animationDelay:`${i * 0.4}s`,
                  }}/>
                  <span style={{
                    fontFamily:"var(--font-mono)", fontSize:"11px",
                    color: isSelected ? "var(--cyan)" : "var(--text-primary)",
                    letterSpacing:"0.04em",
                  }}>{tower._id}</span>
                </div>
                <span style={{
                  fontFamily:"var(--font-mono)", fontSize:"9px",
                  color:"var(--text-secondary)",
                }}>📡 {coverage}m</span>
              </div>

              {/* Tower meta row */}
              <div style={{ display:"flex", gap:"8px" }}>
                <Tag label="ACTIVE" color="var(--green)" />
                <Tag label={`COV ${coverage}m`} color="var(--cyan-dim)" />
              </div>
            </div>
          );
        })}

      </div>
    </aside>
  );
}

/* ── Small helpers ── */

function SectionHeader({ label, count, open, onToggle, onExport, style }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"8px 12px 4px",
      ...style,
    }}>
      <button
        onClick={onToggle}
        style={{
          background:"none", border:"none", cursor:"pointer",
          display:"flex", alignItems:"center", gap:"6px", padding:0,
        }}
      >
        <span style={{
          fontFamily:"var(--font-mono)", fontSize:"9px",
          letterSpacing:"0.18em", color:"var(--text-label)",
        }}>{label}</span>
        <span style={{
          background:"rgba(0,210,200,0.12)",
          border:"1px solid rgba(0,210,200,0.2)",
          borderRadius:"10px", padding:"0 6px",
          fontFamily:"var(--font-mono)", fontSize:"9px", color:"var(--cyan)",
        }}>{count}</span>
        <span style={{ color:"var(--text-secondary)", fontSize:"10px" }}>{open ? "▾" : "▸"}</span>
      </button>
      {onExport && (
        <button
          onClick={onExport}
          title="Export CSV"
          style={{
            background:"rgba(0,210,200,0.07)",
            border:"1px solid rgba(0,210,200,0.2)",
            borderRadius:"4px", padding:"2px 8px",
            fontFamily:"var(--font-mono)", fontSize:"8px",
            letterSpacing:"0.1em", color:"var(--cyan)", cursor:"pointer",
          }}
        >↓ CSV</button>
      )}
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div style={{
      flex:1, background:"var(--bg-card)",
      border:"1px solid var(--border)", borderRadius:"5px",
      padding:"6px 8px", textAlign:"center",
    }}>
      <div style={{ fontFamily:"var(--font-mono)", fontSize:"7px", color:"var(--text-secondary)", letterSpacing:"0.14em", marginBottom:"2px" }}>
        {label}
      </div>
      <div style={{ fontFamily:"var(--font-hud)", fontSize:"14px", fontWeight:700, color: color ?? "var(--text-primary)" }}>
        {value}
      </div>
    </div>
  );
}

function Tag({ label, color }) {
  return (
    <span style={{
      fontFamily:"var(--font-mono)", fontSize:"8px",
      letterSpacing:"0.1em", color,
      background:`${color}15`,
      border:`1px solid ${color}30`,
      borderRadius:"3px", padding:"1px 5px",
    }}>{label}</span>
  );
}
