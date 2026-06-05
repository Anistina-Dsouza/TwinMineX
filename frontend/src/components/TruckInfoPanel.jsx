export default function TruckInfoPanel({ truck, onClose }) {
  if (!truck) return null;

  const rows = [
    { label: "SPEED",   value: `${truck.speed} km/h`,  color: "var(--cyan)" },
    { label: "SIGNAL",  value: `${truck.signal}%`,     color: truck.signal  >= 80 ? "var(--green)" : "var(--amber)" },
    { label: "FUEL",    value: `${truck.fuel}%`,        color: truck.fuel    >= 50 ? "var(--green)" : "var(--amber)" },
    { label: "BATTERY", value: `${truck.battery}%`,    color: "var(--green)" },
    { label: "LATENCY", value: `${truck.latency} ms`,  color: truck.latency < 20  ? "var(--green)" : "var(--amber)" },
  ];

  return (
    <div style={{
      width: "210px",
      background: "rgba(19,24,32,0.95)",
      backdropFilter: "blur(18px)",
      WebkitBackdropFilter: "blur(18px)",
      border: "1px solid rgba(0,210,200,0.35)",
      borderRadius: "6px",
      overflow: "hidden",
      boxShadow: "0 0 30px rgba(0,210,200,0.1)",
      animation: "fade-up 0.2s ease-out",
    }}>
      {/* Header */}
      <div style={{
        padding: "10px 12px",
        borderBottom: "1px solid var(--border)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(0,210,200,0.06)",
      }}>
        <div>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "8px",
            letterSpacing: "0.2em", color: "var(--cyan-dim)",
          }}>SELECTED UNIT</div>
          <div style={{
            fontFamily: "var(--font-hud)", fontSize: "20px", fontWeight: 700,
            letterSpacing: "0.1em", color: "var(--cyan)", lineHeight: 1.1,
          }}>{truck.id}</div>
        </div>
        <button onClick={onClose} style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid var(--border)",
          color: "var(--text-secondary)",
          borderRadius: "4px", width: "22px", height: "22px",
          cursor: "pointer", fontSize: "11px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>✕</button>
      </div>

      {/* Stats */}
      <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {rows.map(r => (
          <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "9px",
              letterSpacing: "0.14em", color: "var(--text-secondary)",
            }}>{r.label}</span>
            <span style={{
              fontFamily: "var(--font-hud)", fontSize: "14px",
              fontWeight: 600, color: r.color, letterSpacing: "0.04em",
            }}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
