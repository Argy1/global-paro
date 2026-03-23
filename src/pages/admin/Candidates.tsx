import { useState, useMemo, useCallback } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import CandidateFilters, { defaultFilters, type CandidateFilterValues } from "@/components/admin/candidates/CandidateFilters";
import BulkActionsBar from "@/components/admin/candidates/BulkActionsBar";
import CandidateDetailPanel from "@/components/admin/candidates/CandidateDetailPanel";

export default function AdminCandidates() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<CandidateFilterValues>(defaultFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data: candidates, isLoading } = useQuery({
    queryKey: ["admin_candidates"],
    queryFn: async () => {
      const { data, error } = await supabase.from("candidates").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateCandidate = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const { error } = await supabase.from("candidates").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_candidates"] });
      toast({ title: "Candidate updated" });
    },
    onError: () => toast({ title: "Update failed", variant: "destructive" }),
  });

  const bulkUpdate = useMutation({
    mutationFn: async ({ ids, updates }: { ids: string[]; updates: Record<string, any> }) => {
      const { error } = await supabase.from("candidates").update(updates).in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_candidates"] });
      setSelectedIds(new Set());
      toast({ title: `${selectedIds.size} candidates updated` });
    },
    onError: () => toast({ title: "Bulk update failed", variant: "destructive" }),
  });

  // Extract unique countries from target_countries
  const countries = useMemo(() => {
    if (!candidates) return [];
    const set = new Set<string>();
    candidates.forEach((c: any) => c.target_countries?.forEach((tc: string) => set.add(tc)));
    return Array.from(set).sort();
  }, [candidates]);

  const filtered = useMemo(() => {
    if (!candidates) return [];
    return candidates.filter((c: any) => {
      const f = filters;
      const matchSearch = !f.search || c.full_name?.toLowerCase().includes(f.search.toLowerCase()) || c.email?.toLowerCase().includes(f.search.toLowerCase()) || c.whatsapp_number?.includes(f.search);
      const matchStage = f.stage === "all" || c.journey_stage === f.stage;
      const matchVerified = f.verified === "all" || (f.verified === "verified" && c.email_verified) || (f.verified === "unverified" && !c.email_verified);
      const matchSpecialty = f.specialty === "all" || c.specialty === f.specialty;
      const matchProfession = f.profession === "all" || c.profession === f.profession;
      const matchEducation = f.education === "all" || c.education_level === f.education;
      const matchEnglish = f.english === "all" || c.english_level === f.english || c.english_capability === f.english;
      const matchAvailability = f.availability === "all" || c.availability === f.availability;
      const matchLicense = f.license === "all" || c.license_status === f.license;
      const matchCountry = f.country === "all" || c.target_countries?.includes(f.country);
      return matchSearch && matchStage && matchVerified && matchSpecialty && matchProfession && matchEducation && matchEnglish && matchAvailability && matchLicense && matchCountry;
    });
  }, [candidates, filters]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((c: any) => c.id)));
    }
  }, [filtered, selectedIds.size]);

  const exportCSV = () => {
    if (!filtered.length) return;
    const headers = ["Full Name", "Email", "WhatsApp", "University", "English", "Stage", "Verified", "Date"];
    const rows = filtered.map((c: any) => [
      c.full_name, c.email || "", c.whatsapp_number, c.university || "", c.english_capability || c.english_level || "", c.journey_stage, c.email_verified ? "Yes" : "No", new Date(c.created_at).toLocaleDateString(),
    ]);
    const csv = [headers.join(","), ...rows.map((r: string[]) => r.map((v) => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `candidates-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const selected = candidates?.find((c: any) => c.id === selectedId) as any;
  const allChecked = filtered.length > 0 && selectedIds.size === filtered.length;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-extrabold text-foreground">Candidates</h1>
        <Button variant="outline" size="sm" onClick={exportCSV} disabled={!filtered.length}>
          <Download className="h-4 w-4 mr-1" /> Export CSV
        </Button>
      </div>

      <CandidateFilters filters={filters} onChange={setFilters} countries={countries} />

      <BulkActionsBar
        selectedCount={selectedIds.size}
        onClearSelection={() => setSelectedIds(new Set())}
        onBulkUpdateStage={(stage) => bulkUpdate.mutate({ ids: Array.from(selectedIds), updates: { journey_stage: stage } })}
        onBulkUpdatePipeline={(status) => bulkUpdate.mutate({ ids: Array.from(selectedIds), updates: { pipeline_status: status } })}
      />

      <div className="flex gap-6">
        <div className={`flex-1 min-w-0 ${selected ? "hidden lg:block" : ""}`}>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <div className="bg-card rounded-xl border border-border overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-3 py-3 w-10">
                      <Checkbox checked={allChecked} onCheckedChange={toggleAll} aria-label="Select all" />
                    </th>
                    {["Name", "Email", "WhatsApp", "Stage", "Verified", "Date"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c: any) => (
                    <tr key={c.id} className={`border-t border-border cursor-pointer hover:bg-muted/50 transition-colors ${selectedId === c.id ? "bg-muted" : ""}`}>
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={selectedIds.has(c.id)} onCheckedChange={() => toggleSelect(c.id)} aria-label={`Select ${c.full_name}`} />
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground" onClick={() => setSelectedId(c.id)}>{c.full_name}</td>
                      <td className="px-4 py-3 text-muted-foreground" onClick={() => setSelectedId(c.id)}>{c.email || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground" onClick={() => setSelectedId(c.id)}>{c.whatsapp_number}</td>
                      <td className="px-4 py-3" onClick={() => setSelectedId(c.id)}>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">{c.journey_stage}</span>
                      </td>
                      <td className="px-4 py-3" onClick={() => setSelectedId(c.id)}>
                        <span className={`h-2 w-2 rounded-full inline-block ${c.email_verified ? "bg-accent" : "bg-muted-foreground/30"}`} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground" onClick={() => setSelectedId(c.id)}>{new Date(c.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <p className="text-center py-8 text-muted-foreground">No candidates match filters.</p>}
              <div className="px-4 py-2 text-xs text-muted-foreground border-t border-border">
                Showing {filtered.length} of {candidates?.length || 0}
              </div>
            </div>
          )}
        </div>

        {selected && (
          <CandidateDetailPanel
            selected={selected}
            onClose={() => setSelectedId(null)}
            onUpdate={(id, updates) => updateCandidate.mutate({ id, updates })}
          />
        )}
      </div>
    </AdminLayout>
  );
}
