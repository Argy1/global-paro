import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { useDeviceSplit } from "@/hooks/useDashboardData";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const DEVICE_COLORS: Record<string, string> = {
  mobile: "hsl(var(--primary))",
  tablet: "hsl(var(--accent))",
  desktop: "#6366f1",
  unknown: "hsl(var(--muted-foreground))",
};

const DEVICE_ICONS: Record<string, React.ElementType> = {
  mobile: Smartphone,
  tablet: Tablet,
  desktop: Monitor,
};

function DeviceTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
      <p className="text-xs font-semibold text-foreground capitalize mb-1">{d.name}</p>
      <p className="text-sm font-bold" style={{ color: d.payload.fill }}>{d.value} registrant{d.value !== 1 ? "s" : ""}</p>
      <p className="text-[10px] text-muted-foreground mt-1">{((d.percent || 0) * 100).toFixed(1)}% of total</p>
    </div>
  );
}

export function DeviceSplitCard() {
  const { data, isLoading } = useDeviceSplit();

  const total = (data || []).reduce((sum, d) => sum + d.value, 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Monitor className="h-4 w-4 text-primary" /> Registration Device Split
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-52 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        ) : total === 0 ? (
          <div className="h-52 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No data yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={68}
                  >
                    {(data || []).map((entry, i) => (
                      <Cell
                        key={i}
                        fill={DEVICE_COLORS[entry.name] || DEVICE_COLORS.unknown}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<DeviceTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(data || []).map((entry) => {
                const Icon = DEVICE_ICONS[entry.name] || Monitor;
                const pct = total > 0 ? Math.round((entry.value / total) * 100) : 0;
                return (
                  <div key={entry.name} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
                    <Icon className="h-4 w-4" style={{ color: DEVICE_COLORS[entry.name] || "hsl(var(--muted-foreground))" }} />
                    <p className="text-xs font-bold text-foreground">{pct}%</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{entry.name}</p>
                    <p className="text-[10px] text-muted-foreground">{entry.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
