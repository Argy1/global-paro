import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { useResponseTimeAnalytics } from "@/hooks/useDashboardData";

export function ResponseTimeCard() {
  const { data, isLoading } = useResponseTimeAnalytics();

  if (isLoading) return <Card><CardContent className="p-6 text-sm text-muted-foreground">Loading…</CardContent></Card>;
  if (!data) return null;

  const formatTime = (min: number) => {
    if (min < 60) return `${min}m`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const metrics = [
    {
      label: "Avg. First Response",
      value: formatTime(data.avgResponseMin),
      sub: data.avgResponseMin <= 15 ? "Within SLA" : "Above SLA target",
      icon: Clock,
      color: data.avgResponseMin <= 15 ? "text-green-500" : "text-destructive",
    },
    {
      label: "SLA Compliance",
      value: `${data.slaRate}%`,
      sub: `${data.resolved}/${data.total} tickets responded in ≤15min`,
      icon: data.slaRate >= 80 ? CheckCircle2 : AlertTriangle,
      color: data.slaRate >= 80 ? "text-green-500" : data.slaRate >= 50 ? "text-amber-500" : "text-destructive",
    },
    {
      label: "Avg. Resolution Time",
      value: formatTime(data.avgResolveMin),
      sub: `${data.resolved} tickets resolved`,
      icon: CheckCircle2,
      color: "text-primary",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" /> Response Time Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-start gap-3">
            <m.icon className={`h-5 w-5 mt-0.5 ${m.color}`} />
            <div>
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className={`text-2xl font-extrabold ${m.color}`}>{m.value}</p>
              <p className="text-[10px] text-muted-foreground">{m.sub}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
