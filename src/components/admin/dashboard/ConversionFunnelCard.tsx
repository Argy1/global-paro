import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";
import { useConversionRates } from "@/hooks/useDashboardData";

export function ConversionFunnelCard() {
  const { data, isLoading } = useConversionRates();

  if (isLoading) return <Card><CardContent className="p-6 text-sm text-muted-foreground">Loading…</CardContent></Card>;

  const stages = (data || []).filter((_, i) => i < (data?.length ?? 1) - 1);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" /> Pipeline Conversion Rates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {stages.map((s) => (
            <div key={s.from} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-foreground font-medium truncate">{s.from} → {s.to}</span>
                  <span className={`font-bold ${s.rate >= 50 ? "text-green-500" : s.rate >= 25 ? "text-amber-500" : "text-destructive"}`}>
                    {s.rate}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.max(s.rate, 2)}%`,
                      backgroundColor: s.rate >= 50 ? "hsl(var(--primary))" : s.rate >= 25 ? "#f59e0b" : "hsl(var(--destructive))",
                    }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{s.count} → {s.nextCount} candidates</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
