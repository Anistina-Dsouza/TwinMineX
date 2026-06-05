import { useEffect, useState } from "react";

export default function StatusBar({ trucks, towers }) {
  const [sync, setSync] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSync(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const avgSignal = trucks?.length
    ? Math.round(trucks.reduce((s, t) => s + (t.signal ?? 0), 0) / trucks.length)
    : 0;
  const syncLabel = sync < 60 ? `${sync}s ago` : `${Math.floor(sync/60)}m ago`;

  return (
    <div style={{
      height:"var(--statusbar-h)",
      background:"var(--bg-topbar)",
      borderTop:"1px solid var(--border)",
      display:"flex", alignItems:"center",
      padding:"0 20px", gap:"0",
      flexShrink:0,
    }}>
      {/* Left stats */}
      <div style={{ display:"flex", alignItems:"center", gap:"0", flex:1 }}>
        <Stat icon="🚚" label="Trucks"     value={trucks?.length ?? 0} />
        <Sep/>
        <Stat icon="📡" label="Towers"     value={towers?.length ?? 0} />
        <Sep/>
        <Stat icon="📶" label="Avg Signal" value={`${avgSignal}%`} color="var(--cyan)" />
        <Sep/>
        <Stat icon="⚡" label="Status"     value="ACTIVE" color="var(--green)" />
        <Sep/>
        <Stat icon="🕐" label="Last Sync"  value={syncLabel} color="var(--text-secondary)" />
      </div>

      {/* Right */}
      <div style={{
        fontFamily:"var(--font-mono)", fontSize:"9px",
        color:"var(--text-secondary)", letterSpacing:"0.08em",
      }}>
        © 2025 Industrial Digital Twin Systems &nbsp;|&nbsp;
        <span style={{ color:"var(--green)" }}>OPERATIONAL</span>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, color }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"7px", padding:"0 16px" }}>
      <span style={{ fontSize:"12px" }}>{icon}</span>
      <span style={{ fontFamily:"var(--font-mono)", fontSize:"9px", color:"var(--text-secondary)", letterSpacing:"0.1em" }}>
        {label}:
      </span>
      <span style={{ fontFamily:"var(--font-mono)", fontSize:"10px", fontWeight:600, color: color ?? "var(--text-primary)" }}>
        {value}
      </span>
    </div>
  );
}

function Sep() {
  return <div style={{ width:"1px", height:"16px", background:"var(--border)" }}/>;
}
