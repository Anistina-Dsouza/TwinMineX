export default function EnvironmentPanel() {
  return (
    <div style={{
      width:"210px",
      background:"rgba(13,20,34,0.92)",
      backdropFilter:"blur(16px)",
      WebkitBackdropFilter:"blur(16px)",
      border:"1px solid var(--border)",
      borderRadius:"6px", overflow:"hidden",
    }}>
      <div style={{
        padding:"8px 12px", borderBottom:"1px solid var(--border)",
        display:"flex", alignItems:"center", gap:"8px",
        background:"rgba(0,210,200,0.04)",
      }}>
        <span style={{ fontSize:"12px" }}>🌡</span>
        <span style={{ fontFamily:"var(--font-mono)", fontSize:"9px", letterSpacing:"0.18em", color:"var(--cyan)" }}>
          ENVIRONMENTAL
        </span>
      </div>
      <div style={{ padding:"10px 12px", display:"flex", flexDirection:"column", gap:"10px" }}>
        <EnvRow label="AIR QUALITY"   value="94%"  pct={94} color="var(--green)" />
        <EnvRow label="TEMP GRADIENT" value="24°C" pct={48} color="var(--amber)" />
        <EnvRow label="DUST LEVEL"    value="12%"  pct={12} color="var(--cyan)" />
      </div>
    </div>
  );
}

function EnvRow({ label, value, pct, color }) {
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
        <span style={{ fontFamily:"var(--font-mono)", fontSize:"9px", letterSpacing:"0.1em", color:"var(--text-secondary)" }}>
          {label}
        </span>
        <span style={{ fontFamily:"var(--font-mono)", fontSize:"10px", color, fontWeight:600 }}>
          {value}
        </span>
      </div>
      <div style={{ height:"3px", background:"rgba(255,255,255,0.05)", borderRadius:"2px" }}>
        <div style={{ width:`${pct}%`, height:"100%", background:color, borderRadius:"2px", boxShadow:`0 0 5px ${color}70` }}/>
      </div>
    </div>
  );
}
