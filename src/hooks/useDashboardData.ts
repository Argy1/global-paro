import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, differenceInMinutes, subMonths, startOfMonth, endOfMonth } from "date-fns";

/* ─── Generic count hooks ─── */

export function useCount(table: "candidates" | "employer_inquiries" | "chat_escalation_tickets" | "content_items") {
  return useQuery({
    queryKey: ["admin_count", table],
    queryFn: async () => {
      const { count, error } = await supabase.from(table as any).select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });
}

export function useCountThisWeek(table: "candidates" | "employer_inquiries") {
  return useQuery({
    queryKey: ["admin_count_week", table],
    queryFn: async () => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { count, error } = await supabase
        .from(table as any)
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekAgo.toISOString());
      if (error) throw error;
      return count || 0;
    },
  });
}

/* ─── Open tickets ─── */

export function useOpenTickets() {
  return useQuery({
    queryKey: ["admin_open_tickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_escalation_tickets")
        .select("*")
        .neq("status", "Resolved");
      if (error) throw error;
      return data || [];
    },
  });
}

/* ─── Pipeline data ─── */

const STAGES = ["new", "contacted", "screened", "qualified", "in_process", "placed", "closed"] as const;
const STAGE_LABELS: Record<string, string> = {
  new: "New", contacted: "Contacted", screened: "Screened",
  qualified: "Qualified", in_process: "In Process", placed: "Placed", closed: "Closed",
};

export function usePipelineData() {
  return useQuery({
    queryKey: ["admin_pipeline"],
    queryFn: async () => {
      const { data, error } = await supabase.from("candidates").select("pipeline_status");
      if (error) throw error;
      const counts: Record<string, number> = {};
      STAGES.forEach((s) => (counts[s] = 0));
      (data || []).forEach((c: any) => {
        if (counts[c.pipeline_status] !== undefined) counts[c.pipeline_status]++;
      });
      return STAGES.map((s) => ({ name: STAGE_LABELS[s], key: s, value: counts[s], fill: "" }));
    },
  });
}

/* ─── Conversion funnel rates ─── */

export function useConversionRates() {
  return useQuery({
    queryKey: ["admin_conversion_rates"],
    queryFn: async () => {
      const { data, error } = await supabase.from("candidates").select("pipeline_status");
      if (error) throw error;
      const counts: Record<string, number> = {};
      STAGES.forEach((s) => (counts[s] = 0));
      (data || []).forEach((c: any) => {
        if (counts[c.pipeline_status] !== undefined) counts[c.pipeline_status]++;
      });
      // Cumulative: count of candidates who reached at least this stage
      const cumulative: number[] = [];
      let running = 0;
      // Reverse accumulate: someone "placed" also passed through all prior stages
      const ordered = [...STAGES];
      const raw = ordered.map((s) => counts[s]);
      // Cumulative from right: candidates at stage X or later
      for (let i = ordered.length - 1; i >= 0; i--) {
        running += raw[i];
        cumulative[i] = running;
      }
      // Now cumulative[0] = total candidates
      const total = cumulative[0] || 1;
      return ordered.map((s, i) => ({
        from: STAGE_LABELS[s],
        to: i < ordered.length - 1 ? STAGE_LABELS[ordered[i + 1]] : "—",
        count: cumulative[i],
        nextCount: i < ordered.length - 1 ? cumulative[i + 1] : 0,
        rate: i < ordered.length - 1 ? Math.round((cumulative[i + 1] / cumulative[i]) * 100) || 0 : 0,
        overallRate: Math.round((cumulative[i] / total) * 100),
      }));
    },
  });
}

/* ─── Monthly comparison ─── */

export function useMonthlyComparison() {
  return useQuery({
    queryKey: ["admin_monthly_comparison"],
    queryFn: async () => {
      const now = new Date();
      const thisMonthStart = startOfMonth(now);
      const thisMonthEnd = endOfMonth(now);
      const lastMonthStart = startOfMonth(subMonths(now, 1));
      const lastMonthEnd = endOfMonth(subMonths(now, 1));

      const [thisMonth, lastMonth, thisMonthEmp, lastMonthEmp] = await Promise.all([
        supabase.from("candidates").select("*", { count: "exact", head: true })
          .gte("created_at", thisMonthStart.toISOString()).lte("created_at", thisMonthEnd.toISOString()),
        supabase.from("candidates").select("*", { count: "exact", head: true })
          .gte("created_at", lastMonthStart.toISOString()).lte("created_at", lastMonthEnd.toISOString()),
        supabase.from("employer_inquiries").select("*", { count: "exact", head: true })
          .gte("created_at", thisMonthStart.toISOString()).lte("created_at", thisMonthEnd.toISOString()),
        supabase.from("employer_inquiries").select("*", { count: "exact", head: true })
          .gte("created_at", lastMonthStart.toISOString()).lte("created_at", lastMonthEnd.toISOString()),
      ]);

      const thisC = thisMonth.count || 0;
      const lastC = lastMonth.count || 0;
      const thisE = thisMonthEmp.count || 0;
      const lastE = lastMonthEmp.count || 0;

      const pctChange = (curr: number, prev: number) =>
        prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / prev) * 100);

      return {
        candidates: { thisMonth: thisC, lastMonth: lastC, change: pctChange(thisC, lastC) },
        employers: { thisMonth: thisE, lastMonth: lastE, change: pctChange(thisE, lastE) },
        thisMonthLabel: format(now, "MMM yyyy"),
        lastMonthLabel: format(subMonths(now, 1), "MMM yyyy"),
      };
    },
  });
}

/* ─── Response time analytics ─── */

export function useResponseTimeAnalytics() {
  return useQuery({
    queryKey: ["admin_response_time"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_escalation_tickets")
        .select("created_at, first_response_at, resolved_at, status");
      if (error) throw error;

      const tickets = data || [];
      const total = tickets.length;
      const resolved = tickets.filter((t) => t.status === "Resolved");
      const responded = tickets.filter((t) => t.first_response_at);

      // Average first response time (minutes)
      const responseTimes = responded.map((t) =>
        differenceInMinutes(new Date(t.first_response_at!), new Date(t.created_at))
      );
      const avgResponseMin = responseTimes.length
        ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
        : 0;

      // SLA compliance (responded within 15 min)
      const withinSLA = responseTimes.filter((m) => m <= 15).length;
      const slaRate = responded.length ? Math.round((withinSLA / responded.length) * 100) : 100;

      // Average resolution time (minutes)
      const resolveTimes = resolved
        .filter((t) => t.resolved_at)
        .map((t) => differenceInMinutes(new Date(t.resolved_at!), new Date(t.created_at)));
      const avgResolveMin = resolveTimes.length
        ? Math.round(resolveTimes.reduce((a, b) => a + b, 0) / resolveTimes.length)
        : 0;

      return { total, resolved: resolved.length, avgResponseMin, slaRate, avgResolveMin };
    },
  });
}

/* ─── Employer heatmap data ─── */

export function useEmployerHeatmap() {
  return useQuery({
    queryKey: ["admin_employer_heatmap"],
    queryFn: async () => {
      const { data, error } = await supabase.from("employer_inquiries").select("country, nurses_needed");
      if (error) throw error;
      const map: Record<string, { count: number; nurses: number }> = {};
      (data || []).forEach((e: any) => {
        const country = e.country || "Unknown";
        if (!map[country]) map[country] = { count: 0, nurses: 0 };
        map[country].count++;
        map[country].nurses += e.nurses_needed || 0;
      });
      return Object.entries(map)
        .map(([country, { count, nurses }]) => ({ country, inquiries: count, nursesNeeded: nurses }))
        .sort((a, b) => b.inquiries - a.inquiries);
    },
  });
}

/* ─── Target countries ─── */

export function useTargetCountries() {
  return useQuery({
    queryKey: ["admin_target_countries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("candidates").select("target_countries");
      if (error) throw error;
      const map: Record<string, number> = {};
      (data || []).forEach((c: any) => {
        (c.target_countries || []).forEach((country: string) => {
          map[country] = (map[country] || 0) + 1;
        });
      });
      return Object.entries(map)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);
    },
  });
}

/* ─── Recent candidates ─── */

export function useRecentCandidates() {
  return useQuery({
    queryKey: ["admin_recent_candidates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select("id, full_name, created_at, pipeline_status, city_country")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data || [];
    },
  });
}

/* ─── Recent employers ─── */

export function useRecentEmployers() {
  return useQuery({
    queryKey: ["admin_recent_employers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employer_inquiries")
        .select("id, institution_name, company_name, created_at, employer_status")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data || [];
    },
  });
}

/* ─── Daily registrations ─── */

export function useDailyRegistrations() {
  return useQuery({
    queryKey: ["admin_daily_registrations"],
    queryFn: async () => {
      const since = subDays(new Date(), 13);
      const { data, error } = await supabase
        .from("candidates")
        .select("created_at")
        .gte("created_at", since.toISOString());
      if (error) throw error;
      const dayMap: Record<string, number> = {};
      for (let i = 0; i < 14; i++) {
        const d = format(subDays(new Date(), 13 - i), "MM/dd");
        dayMap[d] = 0;
      }
      (data || []).forEach((c: any) => {
        const d = format(new Date(c.created_at), "MM/dd");
        if (dayMap[d] !== undefined) dayMap[d]++;
      });
      return Object.entries(dayMap).map(([date, count]) => ({ date, count }));
    },
  });
}

/* ─── Device split ─── */

export function useDeviceSplit() {
  return useQuery({
    queryKey: ["admin_device_split"],
    queryFn: async () => {
      const { data, error } = await supabase.from("candidates").select("device_type");
      if (error) throw error;
      const map: Record<string, number> = { mobile: 0, tablet: 0, desktop: 0 };
      (data || []).forEach((c: any) => {
        const key = c.device_type || "unknown";
        map[key] = (map[key] || 0) + 1;
      });
      return Object.entries(map)
        .filter(([, v]) => v > 0)
        .map(([name, value]) => ({ name, value }));
    },
  });
}
