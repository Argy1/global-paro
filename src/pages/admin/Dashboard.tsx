import { useRef, useCallback } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Users, Building2, MessageSquare, FileText, ArrowRight, AlertTriangle, TrendingUp, Globe, Printer, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { format, differenceInMinutes } from "date-fns";

import {
  useCount, useCountThisWeek, useOpenTickets, usePipelineData,
  useTargetCountries, useRecentCandidates, useRecentEmployers, useDailyRegistrations,
} from "@/hooks/useDashboardData";
import { BarTooltip, PieTooltip } from "@/components/admin/dashboard/ChartTooltips";
import { ConversionFunnelCard } from "@/components/admin/dashboard/ConversionFunnelCard";
import { MonthlyComparisonCard } from "@/components/admin/dashboard/MonthlyComparisonCard";
import { ResponseTimeCard } from "@/components/admin/dashboard/ResponseTimeCard";
import { EmployerHeatmapCard } from "@/components/admin/dashboard/EmployerHeatmapCard";
import { DeviceSplitCard } from "@/components/admin/dashboard/DeviceSplitCard";

/* ─── colors ─── */
const FUNNEL_COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "#f59e0b", "#10b981", "#6366f1", "#ec4899", "#94a3b8"];
const PIE_COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "#f59e0b", "#10b981", "#6366f1", "#ec4899", "#94a3b8", "#f97316"];

/* ─── component ─── */
export default function AdminDashboard() {
  const reportRef = useRef<HTMLDivElement>(null);
  const candidates = useCount("candidates");
  const employers = useCount("employer_inquiries");
  const openTickets = useOpenTickets();
  const content = useCount("content_items");
  const candidatesWeek = useCountThisWeek("candidates");
  const employersWeek = useCountThisWeek("employer_inquiries");
  const pipelineData = usePipelineData();
  const countryData = useTargetCountries();
  const recentCandidates = useRecentCandidates();
  const recentEmployers = useRecentEmployers();
  const dailyRegs = useDailyRegistrations();

  const openCount = openTickets.data?.length || 0;
  const breachedTickets = (openTickets.data || []).filter(
    (t) => !t.first_response_at && differenceInMinutes(new Date(), new Date(t.created_at)) > 15
  );

  const stats = [
    { label: "Total Candidates", value: candidates.data, sub: `+${candidatesWeek.data ?? 0} this week`, icon: Users, color: "text-primary" },
    { label: "Employer Inquiries", value: employers.data, sub: `+${employersWeek.data ?? 0} this week`, icon: Building2, color: "text-accent" },
    { label: "Open Tickets", value: openCount, sub: `${breachedTickets.length} breaching SLA`, icon: MessageSquare, color: breachedTickets.length > 0 ? "text-destructive" : "text-primary" },
    { label: "Content Items", value: content.data, sub: "Articles & chapters", icon: FileText, color: "text-primary" },
  ];

  const handlePrint = useCallback(() => { window.print(); }, []);

  const handleExportCSV = useCallback(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    const lines = [
      "Global Nurse Admin Report - " + today, "",
      "KPI Summary",
      `Total Candidates,${candidates.data ?? 0}`,
      `New This Week,${candidatesWeek.data ?? 0}`,
      `Employer Inquiries,${employers.data ?? 0}`,
      `New Inquiries This Week,${employersWeek.data ?? 0}`,
      `Open Tickets,${openCount}`,
      `SLA Breaches,${breachedTickets.length}`,
      `Content Items,${content.data ?? 0}`, "",
      "Pipeline Breakdown", "Stage,Count",
      ...(pipelineData.data || []).map((s) => `${s.name},${s.value}`), "",
      "Target Countries", "Country,Count",
      ...(countryData.data || []).map((c) => `${c.name},${c.value}`), "",
      "Daily Registrations (14d)", "Date,Count",
      ...(dailyRegs.data || []).map((d) => `${d.date},${d.count}`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `admin-report-${today}.csv`; a.click();
    URL.revokeObjectURL(url);
  }, [candidates.data, candidatesWeek.data, employers.data, employersWeek.data, openCount, breachedTickets.length, content.data, pipelineData.data, countryData.data, dailyRegs.data]);

  return (
    <AdminLayout>
      <div ref={reportRef} className="print:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Dashboard</h1>
            <span className="text-xs text-muted-foreground">{format(new Date(), "EEEE, dd MMM yyyy")}</span>
          </div>
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-1" /> Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-1" /> Print
            </Button>
          </div>
        </div>

        {/* SLA Alert Banner */}
        {breachedTickets.length > 0 && (
          <Link to="/admin/chat-escalations" className="block mb-6 print:hidden">
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-center gap-3 hover:bg-destructive/15 transition-colors">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-destructive">
                  ⚠️ {breachedTickets.length} ticket{breachedTickets.length > 1 ? "s" : ""} breaching 15-min SLA
                </p>
                <p className="text-xs text-destructive/80">Click to view and respond immediately</p>
              </div>
              <ArrowRight className="h-4 w-4 text-destructive" />
            </div>
          </Link>
        )}

        {/* KPI Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <Card key={s.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                  <Badge variant="secondary" className="text-[10px] font-medium">{s.sub}</Badge>
                </div>
                <p className="text-3xl font-extrabold text-foreground">{s.value ?? "—"}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* NEW: Monthly Comparison + Response Time */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <MonthlyComparisonCard />
          <ResponseTimeCard />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Registration Trend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Registration Trend (14 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyRegs.data || []}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip content={<BarTooltip />} cursor={{ fill: "hsl(var(--muted) / 0.5)" }} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Target Countries Pie */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" /> Top Target Countries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-52 flex items-center">
                {(countryData.data || []).length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={countryData.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name} (${value})`}>
                        {(countryData.data || []).map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground mx-auto">No data yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* NEW: Conversion Funnel + Employer Heatmap */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ConversionFunnelCard />
          <EmployerHeatmapCard />
        </div>

        {/* Device Split + Pipeline Funnel */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <DeviceSplitCard />
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Candidate Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {(pipelineData.data || []).map((stage, i) => (
                  <div key={stage.name} className="text-center group relative">
                    <div
                      className="rounded-lg mx-auto flex items-center justify-center text-white font-bold text-lg mb-1 cursor-default"
                      style={{
                        backgroundColor: FUNNEL_COLORS[i % FUNNEL_COLORS.length],
                        width: `${100 - i * 8}%`,
                        height: 48,
                        minWidth: 40,
                      }}
                    >
                      {stage.value}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium">{stage.name}</p>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-card border border-border rounded-md px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                      <p className="text-[10px] font-semibold text-foreground">{stage.name}: {stage.value} candidates</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Recent Registrations
              </CardTitle>
              <Link to="/admin/candidates" className="text-xs text-primary hover:underline print:hidden">View all →</Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {(recentCandidates.data || []).length === 0 && (
                <p className="text-sm text-muted-foreground">No registrations yet</p>
              )}
              {(recentCandidates.data || []).map((c: any) => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{c.full_name}</p>
                    <p className="text-[11px] text-muted-foreground">{c.city_country || "—"}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-[10px]">{c.pipeline_status}</Badge>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{format(new Date(c.created_at), "dd MMM, HH:mm")}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-accent" /> Recent Employer Inquiries
              </CardTitle>
              <Link to="/admin/employers" className="text-xs text-primary hover:underline print:hidden">View all →</Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {(recentEmployers.data || []).length === 0 && (
                <p className="text-sm text-muted-foreground">No inquiries yet</p>
              )}
              {(recentEmployers.data || []).map((e: any) => (
                <div key={e.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{e.institution_name || e.company_name || "—"}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-[10px]">{e.employer_status}</Badge>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{format(new Date(e.created_at), "dd MMM, HH:mm")}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
