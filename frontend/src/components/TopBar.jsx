import { useEffect, useState } from "react";
import AlertBell from "./AlertSystem";

export default function TopBar({ truckCount, towerCount, alerts, onAlertTruckSelect, onChartsOpen, heatmapActive, onHeatmapToggle }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const pad = n => String(n).padStart(2, "0");
  const hms  = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
  const date = time.toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }).toUpperCase();

  return (
    <header style={{
      height: "var(--topbar-h)",
      background: "var(--bg-topbar)",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center",
      padding: "0 18px", flexShrink: 0,
      position: "relative", zIndex: 100,
    }}>
      {/* Accent line */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:"2px",
        background:"linear-gradient(90deg,transparent,var(--cyan),transparent)", opacity:0.5,
      }}/>

      {/* Brand */}
      <div style={{
        width:"var(--sidebar-w)", display:"flex", alignItems:"center",
        gap:"10px", paddingRight:"16px", flexShrink:0,
      }}>
        <div style={{
          width:"30px", height:"30px", background:"rgba(0,210,200,0.08)",
          border:"1px solid rgba(0,210,200,0.25)", borderRadius:"6px",
          fontSize:"14px", display:"flex", alignItems:"center", justifyContent:"center",
        }}>⛏</div>
        <div>
          <div style={{ fontFamily:"var(--font-hud)", fontSize:"15px", fontWeight:700, letterSpacing:"0.07em" }}>
            Mine Digital Twin
          </div>
          <div style={{ fontFamily:"var(--font-mono)", fontSize:"8px", color:"var(--text-label)", letterSpacing:"0.18em" }}>
            OPERATIONS CENTER
          </div>
        </div>
      </div>

      <div style={{ width:"1px", height:"24px", background:"var(--border)" }}/>

      {/* Status chips */}
      <div style={{ display:"flex", alignItems:"center", gap:"7px", padding:"0 16px" }}>
        <Chip dot color="var(--green)" label="ONLINE" />
        <Chip icon="🚚" label={`${truckCount} Trucks`} />
        <Chip icon="📡" label={`${towerCount} Towers`} />
      </div>

      <div style={{ flex:1 }}/>

      {/* Action buttons */}
      <div style={{ display:"flex", alignItems:"center", gap:"7px", marginRight:"12px" }}>

        {/* Heatmap toggle */}
        <ActionBtn
          active={heatmapActive}
          onClick={onHeatmapToggle}
          title="Toggle Signal Heatmap"
          label="🌡 HEATMAP"
          activeColor="var(--amber)"
        />

        {/* Live charts */}
        <ActionBtn
          onClick={onChartsOpen}
          title="Open Live Charts"
          label="📈 CHARTS"
          activeColor="var(--cyan)"
        />

        {/* Alert bell */}
        <AlertBell alerts={alerts ?? []} onSelectTruck={onAlertTruckSelect} />

      </div>

      {/* Clock */}
      <div style={{ textAlign:"right" }}>
        <div style={{ fontFamily:"var(--font-mono)", fontSize:"16px", color:"var(--cyan)", letterSpacing:"0.06em", lineHeight:1.1 }}>
          {hms}
        </div>
        <div style={{ fontFamily:"var(--font-mono)", fontSize:"8px", color:"var(--text-secondary)", letterSpacing:"0.1em" }}>
          {date}
        </div>
      </div>
    </header>
  );
}

function Chip({ dot, color, icon, label }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:"6px",
      padding:"4px 10px",
      background: color ? `${color}12` : "rgba(255,255,255,0.03)",
      border:`1px solid ${color ? `${color}28` : "var(--border)"}`,
      borderRadius:"4px", fontFamily:"var(--font-mono)", fontSize:"10px",
      letterSpacing:"0.1em", color: color ?? "var(--text-secondary)",
    }}>
      {dot && <span style={{
        width:"6px", height:"6px", borderRadius:"50%", background:color,
        display:"inline-block", animation:"pulse-dot 2s ease infinite",
      }}/>}
      {icon && <span style={{ fontSize:"11px" }}>{icon}</span>}
      {label}
    </div>
  );
}

function ActionBtn({ active, onClick, title, label, activeColor }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        height:"32px", padding:"0 12px",
        background: active ? `${activeColor}18` : "rgba(255,255,255,0.04)",
        border:`1px solid ${active ? activeColor : "var(--border)"}`,
        borderRadius:"5px", cursor:"pointer",
        fontFamily:"var(--font-mono)", fontSize:"9px",
        letterSpacing:"0.1em",
        color: active ? activeColor : "var(--text-secondary)",
        display:"flex", alignItems:"center", gap:"5px",
        transition:"all 0.15s",
        whiteSpace:"nowrap",
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background="rgba(255,255,255,0.08)"; e.currentTarget.style.color="var(--text-primary)"; }}}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.color="var(--text-secondary)"; }}}
    >
      {label}
    </button>
  );
}
