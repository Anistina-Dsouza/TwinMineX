export default function InfoPanel({ type, data, onClose, onRadiusChange }) {
  if (!data) return null;

  return (
    <div style={{
      width:"220px",
      background:"rgba(13,20,34,0.96)",
      backdropFilter:"blur(18px)",
      WebkitBackdropFilter:"blur(18px)",
      border:"1px solid var(--border-active)",
      borderRadius:"6px", overflow:"hidden",
      boxShadow:"0 0 30px rgba(0,210,200,0.12)",
      animation:"fade-up 0.2s ease-out",
    }}>
      {/* Header */}
      <div style={{
        padding:"10px 12px",
        borderBottom:"1px solid var(--border)",
        display:"flex", justifyContent:"space-between", alignItems:"center",
        background:"rgba(0,210,200,0.06)",
      }}>
        <div>
          <div style={{
            fontFamily:"var(--font-mono)", fontSize:"8px",
            letterSpacing:"0.2em", color:"var(--cyan-dim)",
          }}>{type === "truck" ? "SELECTED UNIT" : "TOWER INFO"}</div>
          <div style={{
            fontFamily:"var(--font-hud)", fontSize:"20px", fontWeight:700,
            letterSpacing:"0.1em", color:"var(--cyan)", lineHeight:1.1,
          }}>{data.id}</div>
        </div>
        <button onClick={onClose} style={{
          background:"rgba(255,255,255,0.05)",
          border:"1px solid var(--border)",
          color:"var(--text-secondary)",
          borderRadius:"4px", width:"22px", height:"22px",
          cursor:"pointer", fontSize:"11px",
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>✕</button>
      </div>

      {/* Body */}
      <div style={{ padding:"10px 12px", display:"flex", flexDirection:"column", gap:"7px" }}>
        {type === "truck" && <>
          <Row label="SPEED"   value={`${data.speed} km/h`}  color="var(--cyan)" />
          <Row label="SIGNAL"  value={`${data.signal}%`}     color={data.signal  >= 80 ? "var(--green)" : "var(--amber)"} />
          <Row label="FUEL"    value={`${data.fuel}%`}        color={data.fuel    >= 50 ? "var(--green)" : "var(--amber)"} />
          <Row label="BATTERY" value={`${data.battery}%`}    color="var(--green)" />
          <Row label="LATENCY" value={`${data.latency} ms`}  color={data.latency < 20 ? "var(--green)" : "var(--amber)"} />
          {/* Fuel bar */}
          <div style={{ marginTop:"4px" }}>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:"8px", color:"var(--text-secondary)", letterSpacing:"0.14em", marginBottom:"4px" }}>FUEL LEVEL</div>
            <div style={{ height:"4px", background:"rgba(255,255,255,0.06)", borderRadius:"2px" }}>
              <div style={{
                width:`${data.fuel}%`, height:"100%",
                background: data.fuel >= 50 ? "var(--green)" : "var(--amber)",
                borderRadius:"2px", transition:"width 0.5s ease",
              }}/>
            </div>
          </div>
        </>}

        {type === "tower" && <>
          <Row label="STATUS"   value="ACTIVE"                color="var(--green)" />
          <Row label="BATTERY"  value={`${Math.round(data.battery ?? 100)}%`} color={(data.battery ?? 100) >= 60 ? "var(--green)" : ((data.battery ?? 100) >= 20 ? "var(--amber)" : "var(--red)")} />
          <Row label="COVERAGE" value={`${data.coverage}m`}  color="var(--cyan)" />
          <Row label="POSITION" value={`${data.x}, ${data.z}`} color="var(--text-primary)" />
          
          <div style={{ marginTop:"8px", borderTop:"1px solid var(--border)", paddingTop:"8px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"4px" }}>
              <span style={{ fontFamily:"var(--font-mono)", fontSize:"9px", letterSpacing:"0.14em", color:"var(--text-secondary)" }}>RADIUS CONTROL</span>
              <span style={{ fontFamily:"var(--font-mono)", fontSize:"11px", color:"var(--cyan)" }}>{data.coverage}m</span>
            </div>
            <input 
              type="range"
              min="100"
              max="1200"
              step="10"
              value={data.coverage}
              onChange={(e) => onRadiusChange?.(data.id, Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: "var(--cyan)",
                cursor: "ew-resize"
              }}
            />
          </div>
          {/* Coverage ring vis */}
          <div style={{ marginTop:"6px", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{
              width:`${Math.min(data.coverage / 4, 80)}px`,
              height:`${Math.min(data.coverage / 4, 80)}px`,
              borderRadius:"50%",
              border:"2px solid rgba(0,255,157,0.35)",
              boxShadow:"0 0 16px rgba(0,255,157,0.15)",
              display:"flex", alignItems:"center", justifyContent:"center",
              position:"relative",
            }}>
              <div style={{
                width:"10px", height:"10px", borderRadius:"50%",
                background:"var(--green)", boxShadow:"0 0 10px var(--green)",
              }}/>
            </div>
          </div>
        </>}
      </div>
    </div>
  );
}

function Row({ label, value, color }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <span style={{ fontFamily:"var(--font-mono)", fontSize:"9px", letterSpacing:"0.14em", color:"var(--text-secondary)" }}>
        {label}
      </span>
      <span style={{ fontFamily:"var(--font-hud)", fontSize:"14px", fontWeight:600, color, letterSpacing:"0.04em" }}>
        {value}
      </span>
    </div>
  );
}
