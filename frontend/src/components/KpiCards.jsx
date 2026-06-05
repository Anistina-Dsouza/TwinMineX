function KpiCards() {
  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        padding: "15px"
      }}
    >
      <Card title="Trucks" value="20" />
      <Card title="Towers" value="4" />
      <Card title="Signal" value="87%" />
      <Card title="Alerts" value="2" />
    </div>
  );
}