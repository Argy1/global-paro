import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, CalendarDays } from "lucide-react";
import { useMonthlyComparison } from "@/hooks/useDashboardData";

function ChangeIndicator({ change }: { change: number }) {
  if (change === 0) return <span className="text-xs text-muted-foreground">0%</span>;
  const isUp = change > 0;
  return (
    <span className={`inline-flex items-center text-xs font-bold ${isUp ? "text-green-500" : "text-destructive"}`}>
      {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {Math.abs(change)}%
    </span>
  );
}

export function MonthlyComparisonCard() {
  const { data, isLoading } = useMonthlyComparison();

  if (isLoading) return <Card><CardContent className="p-6 text-sm text-muted-foreground">Loading…</CardContent></Card>;
  if (!data) return null;

  const rows = [
    { label: "Candidates", thisMonth: data.candidates.thisMonth, lastMonth: data.candidates.lastMonth, change: data.candidates.change },
    { label: "Employer Inquiries", thisMonth: data.employers.thisMonth, lastMonth: data.employers.lastMonth, change: data.employers.change },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" /> Monthly Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 text-[11px] text-muted-foreground font-medium mb-2">
          <span />
          <span className="text-center">{data.lastMonthLabel}</span>
          <span className="text-center">{data.thisMonthLabel}</span>
        </div>
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-3 gap-2 items-center py-3 border-t border-border">
            <span className="text-sm font-medium text-foreground">{r.label}</span>
            <div className="text-center">
              <p className="text-lg font-bold text-muted-foreground">{r.lastMonth}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{r.thisMonth}</p>
              <ChangeIndicator change={r.change} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
