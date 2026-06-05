import { useState, useEffect } from "react";

// Thresholds
const FUEL_WARN    = 30;
const SIGNAL_WARN  = 55;
const BATTERY_WARN = 35;

export function generateAlerts(trucks) {
  const alerts = [];
  trucks.forEach(t => {
    if ((t.fuel ?? 100) < FUEL_WARN)
      alerts.push({ id: `${t._id}-fuel`,    truck: t._id, type: "FUEL",    severity: "critical", msg: `Fuel critical: ${t.fuel}%`,    time: Date.now() });
    if ((t.signal ?? 100) < SIGNAL_WARN)
      alerts.push({ id: `${t._id}-sig`,     truck: t._id, type: "SIGNAL",  severity: "warning",  msg: `Weak signal: ${t.signal}%`,    time: Date.now() });
    if ((t.battery ?? 100) < BATTERY_WARN)
      alerts.push({ id: `${t._id}-bat`,     truck: t._id, type: "BATTERY", severity: "critical", msg: `Battery low: ${t.battery}%`,   time: Date.now() });
  });
  return alerts;
}

export default function AlertBell({ alerts, onSelectTruck }) {
  const [open, setOpen]       = useState(false);
  const [dismissed, setDismissed] = useState(new Set());
  const [newCount, setNewCount]   = useState(0);

  const visible = alerts.filter(a => !dismissed.has(a.id));
  const critical = visible.filter(a => a.severity === "critical");

  // Bump new count when alerts arrive
  useEffect(() => {
    if (visible.length > 0) setNewCount(visible.length);
  }, [alerts.length]);

  const dismiss = (id) => setDismissed(d => new Set([...d, id]));
  const dismissAll = () => setDismissed(new Set(alerts.map(a => a.id)));

  const sevColor = (s) => s === "critical" ? "var(--red)" : "var(--amber)";
  const typeIcon = (t) => ({ FUEL:"⛽", SIGNAL:"📶", BATTERY:"🔋" }[t] ?? "⚠");

  return (
    <>
      {/* Bell button */}
      <button
        onClick={() => { setOpen(o => !o); setNewCount(0); }}
        style={{
          position: "relative",
          width: "34px", height: "34px",
          background: visible.length > 0 ? "rgba(255,69,96,0.1)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${visible.length > 0 ? "rgba(255,69,96,0.4)" : "var(--border)"}`,
          borderRadius: "6px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "15px",
          transition: "all 0.2s",
        }}
        title="Alerts"
      >
        🔔
        {visible.length > 0 && (
          <span style={{
            position: "absolute", top: "-5px", right: "-5px",
            width: "16px", height: "16px", borderRadius: "50%",
            background: critical.length > 0 ? "var(--red)" : "var(--amber)",
            fontSize: "9px", fontFamily: "var(--font-mono)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 700,
            boxShadow: `0 0 8px ${critical.length > 0 ? "var(--red)" : "var(--amber)"}`,
            animation: critical.length > 0 ? "pulse-dot 1.2s ease infinite" : "none",
          }}>
            {visible.length}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          position: "fixed",
          top: "calc(var(--topbar-h) + 8px)",
          right: "16px",
          width: "320px",
          maxHeight: "420px",
          background: "rgba(10,18,32,0.97)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,69,96,0.25)",
          borderRadius: "8px",
          overflow: "hidden",
          zIndex: 999,
          boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
          animation: "fade-up 0.2s ease-out",
        }}>
          {/* Header */}
          <div style={{
            padding: "10px 14px",
            borderBottom: "1px solid var(--border)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "rgba(255,69,96,0.06)",
          }}>
            <div>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:"9px", letterSpacing:"0.18em", color:"var(--red)" }}>
                ALERT MONITOR
              </div>
              <div style={{ fontFamily:"var(--font-hud)", fontSize:"14px", fontWeight:600, color:"var(--text-primary)" }}>
                {visible.length} Active · {critical.length} Critical
              </div>
            </div>
            <div style={{ display:"flex", gap:"6px" }}>
              {visible.length > 0 && (
                <button onClick={dismissAll} style={{
                  background:"rgba(255,255,255,0.05)", border:"1px solid var(--border)",
                  borderRadius:"4px", padding:"3px 8px",
                  fontFamily:"var(--font-mono)", fontSize:"9px",
                  color:"var(--text-secondary)", cursor:"pointer",
                }}>CLEAR ALL</button>
              )}
              <button onClick={() => setOpen(false)} style={{
                background:"none", border:"1px solid var(--border)",
                borderRadius:"4px", width:"22px", height:"22px",
                color:"var(--text-secondary)", cursor:"pointer", fontSize:"12px",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>✕</button>
            </div>
          </div>

          {/* Alert list */}
          <div style={{ overflowY:"auto", maxHeight:"340px", padding:"8px" }}>
            {visible.length === 0 && (
              <div style={{
                padding:"30px", textAlign:"center",
                fontFamily:"var(--font-mono)", fontSize:"11px",
                color:"var(--text-secondary)",
              }}>
                ✅ No active alerts
              </div>
            )}
            {visible.map(a => (
              <div key={a.id} style={{
                marginBottom:"6px", padding:"10px 12px",
                background: `${sevColor(a.severity)}08`,
                border: `1px solid ${sevColor(a.severity)}30`,
                borderLeft: `3px solid ${sevColor(a.severity)}`,
                borderRadius:"5px",
                display:"flex", alignItems:"center", gap:"10px",
              }}>
                <span style={{ fontSize:"16px" }}>{typeIcon(a.type)}</span>
                <div style={{ flex:1 }}>
                  <div style={{
                    display:"flex", justifyContent:"space-between", alignItems:"center",
                    marginBottom:"2px",
                  }}>
                    <span style={{
                      fontFamily:"var(--font-mono)", fontSize:"11px", fontWeight:600,
                      color: sevColor(a.severity), letterSpacing:"0.04em",
                    }}>{a.truck}</span>
                    <span style={{
                      fontFamily:"var(--font-mono)", fontSize:"8px",
                      color:"var(--text-secondary)",
                      background:`${sevColor(a.severity)}15`,
                      border:`1px solid ${sevColor(a.severity)}25`,
                      borderRadius:"3px", padding:"1px 5px",
                    }}>{a.severity.toUpperCase()}</span>
                  </div>
                  <div style={{
                    fontFamily:"var(--font-body)", fontSize:"11px",
                    color:"var(--text-primary)",
                  }}>{a.msg}</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:"4px", alignItems:"center" }}>
                  <button
                    onClick={() => { onSelectTruck?.(a.truck); setOpen(false); }}
                    style={{
                      background:"rgba(0,210,200,0.08)", border:"1px solid rgba(0,210,200,0.25)",
                      borderRadius:"3px", padding:"2px 6px",
                      fontFamily:"var(--font-mono)", fontSize:"8px", color:"var(--cyan)",
                      cursor:"pointer", whiteSpace:"nowrap",
                    }}
                  >VIEW</button>
                  <button
                    onClick={() => dismiss(a.id)}
                    style={{
                      background:"none", border:"none",
                      color:"var(--text-secondary)", cursor:"pointer", fontSize:"11px",
                    }}
                  >✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
