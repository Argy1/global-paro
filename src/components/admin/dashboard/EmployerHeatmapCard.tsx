import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useEmployerHeatmap } from "@/hooks/useDashboardData";

export function EmployerHeatmapCard() {
  const { data, isLoading } = useEmployerHeatmap();

  if (isLoading) return <Card><CardContent className="p-6 text-sm text-muted-foreground">Loading…</CardContent></Card>;

  const items = data || [];
  const maxInquiries = Math.max(...items.map((i) => i.inquiries), 1);

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" /> Employer Demand by Country
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No employer data yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" /> Employer Demand by Country
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => {
          const intensity = item.inquiries / maxInquiries;
          return (
            <div key={item.country} className="group">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-foreground">{item.country}</span>
                <span className="text-muted-foreground">
                  {item.inquiries} inquir{item.inquiries !== 1 ? "ies" : "y"} · {item.nursesNeeded} nurses
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.max(intensity * 100, 5)}%`,
                    backgroundColor: `hsl(var(--primary) / ${0.4 + intensity * 0.6})`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
