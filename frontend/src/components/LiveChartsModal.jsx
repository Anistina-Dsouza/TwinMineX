import { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

const MAX_POINTS = 30;

function makePoint(trucks) {
  const now = new Date();
  const label = `${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
  const obj = { time: label };
  trucks.forEach(t => {
    obj[`${t._id}_signal`]  = t.signal  ?? 0;
    obj[`${t._id}_fuel`]    = t.fuel    ?? 0;
    obj[`${t._id}_speed`]   = t.speed   ?? 0;
  });
  return obj;
}

const CHART_COLORS = [
  "#00d2c8","#3ddc84","#f5a623","#4fc3f7","#ce93d8",
  "#ff8a65","#80cbc4","#fff176","#ef9a9a","#b0bec5",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:"rgba(10,18,32,0.96)", border:"1px solid var(--border)",
      borderRadius:"6px", padding:"8px 12px",
      fontFamily:"var(--font-mono)", fontSize:"10px",
    }}>
      <div style={{ color:"var(--text-secondary)", marginBottom:"4px" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom:"2px" }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

export default function LiveChartsModal({ trucks, open, onClose }) {
  const [history, setHistory]     = useState([]);
  const [metric, setMetric]       = useState("signal");   // signal | fuel | speed
  const [filter, setFilter]       = useState("all");       // all | TRK001…
  const intervalRef = useRef(null);

  // Collect a new data point every 2 seconds
  useEffect(() => {
    if (!open || trucks.length === 0) return;
    // Seed with one point immediately
    setHistory([makePoint(trucks)]);
    intervalRef.current = setInterval(() => {
      setHistory(prev => {
        const next = [...prev, makePoint(trucks)];
        return next.length > MAX_POINTS ? next.slice(-MAX_POINTS) : next;
      });
    }, 2000);
    return () => clearInterval(intervalRef.current);
  }, [open, trucks]);

  if (!open) return null;

  // Which trucks to show
  const activeTrucks = filter === "all"
    ? trucks.slice(0, 10)           // max 10 lines for readability
    : trucks.filter(t => t._id === filter);

  const metricLabel = { signal:"Signal %", fuel:"Fuel %", speed:"Speed km/h" }[metric];

  return (
    <div style={{
      position:"fixed", inset:0,
      background:"rgba(0,0,0,0.6)",
      backdropFilter:"blur(4px)",
      zIndex:500,
      display:"flex", alignItems:"center", justifyContent:"center",
      animation:"fade-up 0.2s ease-out",
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width:"min(900px, 95vw)",
        height:"min(560px, 90vh)",
        background:"rgba(10,18,32,0.98)",
        border:"1px solid var(--border-cyan)",
        borderRadius:"10px", overflow:"hidden",
        display:"flex", flexDirection:"column",
        boxShadow:"0 20px 80px rgba(0,0,0,0.8)",
      }}>

        {/* Header */}
        <div style={{
          padding:"12px 18px",
          borderBottom:"1px solid var(--border)",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          background:"rgba(0,210,200,0.05)", flexShrink:0,
        }}>
          <div>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:"9px", letterSpacing:"0.2em", color:"var(--cyan-dim)" }}>
              LIVE TELEMETRY
            </div>
            <div style={{ fontFamily:"var(--font-hud)", fontSize:"18px", fontWeight:700, color:"var(--cyan)" }}>
              Fleet Analytics
            </div>
          </div>

          {/* Controls row */}
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            {/* Metric selector */}
            {["signal","fuel","speed"].map(m => (
              <button key={m} onClick={() => setMetric(m)} style={{
                padding:"5px 12px",
                background: metric===m ? "rgba(0,210,200,0.15)" : "rgba(255,255,255,0.04)",
                border:`1px solid ${metric===m ? "var(--border-active)" : "var(--border)"}`,
                borderRadius:"4px", cursor:"pointer",
                fontFamily:"var(--font-mono)", fontSize:"10px",
                letterSpacing:"0.1em",
                color: metric===m ? "var(--cyan)" : "var(--text-secondary)",
                transition:"all 0.15s",
              }}>
                {m.toUpperCase()}
              </button>
            ))}

            <div style={{ width:"1px", height:"20px", background:"var(--border)" }}/>

            {/* Truck filter */}
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{
                background:"var(--bg-card)", border:"1px solid var(--border)",
                borderRadius:"4px", padding:"4px 8px",
                fontFamily:"var(--font-mono)", fontSize:"10px",
                color:"var(--text-primary)", cursor:"pointer",
              }}
            >
              <option value="all">ALL TRUCKS (top 10)</option>
              {trucks.map(t => (
                <option key={t._id} value={t._id}>{t._id}</option>
              ))}
            </select>

            <button onClick={onClose} style={{
              background:"rgba(255,255,255,0.05)", border:"1px solid var(--border)",
              borderRadius:"5px", width:"28px", height:"28px",
              color:"var(--text-secondary)", cursor:"pointer", fontSize:"13px",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>✕</button>
          </div>
        </div>

        {/* Chart */}
        <div style={{ flex:1, padding:"16px 12px 8px", minHeight:0 }}>
          {history.length < 2 ? (
            <div style={{
              display:"flex", alignItems:"center", justifyContent:"center",
              height:"100%", flexDirection:"column", gap:"10px",
            }}>
              <div style={{
                width:"28px", height:"28px", borderRadius:"50%",
                border:"2px solid var(--cyan)", borderTopColor:"transparent",
                animation:"corner-spin 0.8s linear infinite",
              }}/>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:"11px", color:"var(--text-secondary)" }}>
                Collecting data…
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top:4, right:10, left:-20, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="time"
                  tick={{ fontFamily:"var(--font-mono)", fontSize:9, fill:"rgba(255,255,255,0.3)" }}
                  tickLine={false} axisLine={{ stroke:"rgba(255,255,255,0.08)" }}
                />
                <YAxis
                  tick={{ fontFamily:"var(--font-mono)", fontSize:9, fill:"rgba(255,255,255,0.3)" }}
                  tickLine={false} axisLine={{ stroke:"rgba(255,255,255,0.08)" }}
                  domain={metric==="speed" ? [0,60] : [0,100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontFamily:"var(--font-mono)", fontSize:"9px", paddingTop:"8px" }}
                />
                {activeTrucks.map((t, i) => (
                  <Line
                    key={t._id}
                    type="monotone"
                    dataKey={`${t._id}_${metric}`}
                    name={t._id}
                    stroke={CHART_COLORS[i % CHART_COLORS.length]}
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Live indicator */}
        <div style={{
          padding:"6px 18px", borderTop:"1px solid var(--border)",
          display:"flex", alignItems:"center", gap:"6px", flexShrink:0,
        }}>
          <span style={{
            width:"6px", height:"6px", borderRadius:"50%",
            background:"var(--green)", display:"inline-block",
            boxShadow:"0 0 6px var(--green)",
            animation:"pulse-dot 1.5s ease infinite",
          }}/>
          <span style={{ fontFamily:"var(--font-mono)", fontSize:"9px", color:"var(--text-secondary)", letterSpacing:"0.1em" }}>
            LIVE · Updates every 2s · Showing {metricLabel} · {history.length} data points
          </span>
        </div>

      </div>
    </div>
  );
}
