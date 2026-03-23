export function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
      <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
      <p className="text-sm text-primary font-bold">{payload[0].value} registration{payload[0].value !== 1 ? "s" : ""}</p>
      <p className="text-[10px] text-muted-foreground mt-1">
        {payload[0].value === 0 ? "No activity this day" : payload[0].value > 3 ? "🔥 High activity day!" : "Normal activity"}
      </p>
    </div>
  );
}

export function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
      <p className="text-xs font-semibold text-foreground mb-1">{d.name}</p>
      <p className="text-sm font-bold" style={{ color: d.payload.fill }}>{d.value} candidate{d.value !== 1 ? "s" : ""}</p>
      <p className="text-[10px] text-muted-foreground mt-1">{((d.percent || 0) * 100).toFixed(1)}% of total</p>
    </div>
  );
}
