import { useState, useMemo, useCallback } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useSetting } from "@/hooks/useSiteSettings";
import { Constants } from "@/integrations/supabase/types";
import EmployerFilters, { defaultEmployerFilters, type EmployerFilterValues } from "@/components/admin/employers/EmployerFilters";
import EmployerBulkBar from "@/components/admin/employers/EmployerBulkBar";

const EMPLOYER_STATUSES = Constants.public.Enums.employer_status_type;

function Field({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-foreground font-medium">{value || "—"}</p>
    </div>
  );
}

export default function AdminEmployers() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<EmployerFilterValues>(defaultEmployerFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { value: bookingLink } = useSetting("booking_20min_link");

  const { data: inquiries, isLoading } = useQuery({
    queryKey: ["admin_employer_inquiries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("employer_inquiries").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateInquiry = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const { error } = await supabase.from("employer_inquiries").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_employer_inquiries"] });
      toast({ title: "Inquiry updated" });
    },
    onError: () => toast({ title: "Update failed", variant: "destructive" }),
  });

  const bulkUpdate = useMutation({
    mutationFn: async ({ ids, updates }: { ids: string[]; updates: Record<string, any> }) => {
      const { error } = await supabase.from("employer_inquiries").update(updates).in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_employer_inquiries"] });
      setSelectedIds(new Set());
      toast({ title: `${selectedIds.size} inquiries updated` });
    },
    onError: () => toast({ title: "Bulk update failed", variant: "destructive" }),
  });

  const countries = useMemo(() => {
    if (!inquiries) return [];
    const set = new Set<string>();
    inquiries.forEach((i: any) => { if (i.country) set.add(i.country); });
    return Array.from(set).sort();
  }, [inquiries]);

  const filtered = useMemo(() => {
    if (!inquiries) return [];
    return inquiries.filter((i: any) => {
      const f = filters;
      const q = f.search.toLowerCase();
      const matchSearch = !f.search || i.institution_name?.toLowerCase().includes(q) || i.company_name?.toLowerCase().includes(q) || i.email?.toLowerCase().includes(q) || i.institutional_email?.toLowerCase().includes(q);
      const matchStatus = f.status === "all" || i.employer_status === f.status;
      const matchCountry = f.country === "all" || i.country === f.country;
      return matchSearch && matchStatus && matchCountry;
    });
  }, [inquiries, filters]);

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
      setSelectedIds(new Set(filtered.map((i: any) => i.id)));
    }
  }, [filtered, selectedIds.size]);

  const selected = inquiries?.find((i: any) => i.id === selectedId) as any;
  const allChecked = filtered.length > 0 && selectedIds.size === filtered.length;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-extrabold text-foreground mb-6">Employer Inquiries</h1>

      <EmployerFilters filters={filters} onChange={setFilters} countries={countries} />

      <EmployerBulkBar
        selectedCount={selectedIds.size}
        onClearSelection={() => setSelectedIds(new Set())}
        onBulkUpdateStatus={(status) => bulkUpdate.mutate({ ids: Array.from(selectedIds), updates: { employer_status: status } })}
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
                    {["Institution", "Email", "Country", "Title", "Status", "Date"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((i: any) => (
                    <tr key={i.id} className={`border-t border-border cursor-pointer hover:bg-muted/50 ${selectedId === i.id ? "bg-muted" : ""}`}>
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={selectedIds.has(i.id)} onCheckedChange={() => toggleSelect(i.id)} aria-label={`Select ${i.institution_name}`} />
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground" onClick={() => setSelectedId(i.id)}>{i.institution_name || i.company_name || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground" onClick={() => setSelectedId(i.id)}>{i.institutional_email || i.email || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground" onClick={() => setSelectedId(i.id)}>{i.country || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground" onClick={() => setSelectedId(i.id)}>{i.title || "—"}</td>
                      <td className="px-4 py-3" onClick={() => setSelectedId(i.id)}>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">{i.employer_status}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground" onClick={() => setSelectedId(i.id)}>{new Date(i.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <p className="text-center py-8 text-muted-foreground">No inquiries match filters.</p>}
              <div className="px-4 py-2 text-xs text-muted-foreground border-t border-border">
                Showing {filtered.length} of {inquiries?.length || 0}
              </div>
            </div>
          )}
        </div>

        {selected && (
          <div className="w-full lg:w-[400px] shrink-0 bg-card rounded-xl border border-border p-6 overflow-y-auto max-h-[calc(100vh-120px)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Inquiry Details</h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedId(null)}><X className="h-4 w-4" /></Button>
            </div>

            <div className="space-y-4 text-sm">
              <Field label="Institution" value={selected.institution_name || selected.company_name} />
              <Field label="Contact Name" value={selected.contact_name} />
              <Field label="Title" value={selected.title} />
              <Field label="Email" value={selected.institutional_email || selected.email} />
              <Field label="Phone" value={selected.contact_mobile || selected.phone} />
              <Field label="Country" value={selected.country} />
              <Field label="Nurses Needed" value={selected.nurses_needed} />
              <Field label="Specialties" value={selected.specialties_needed?.join(", ")} />
              <Field label="Workforce Needs" value={selected.workforce_needs} />
              <Field label="Preferred Timeline" value={selected.preferred_timeline} />
              <Field label="Message" value={selected.message} />

              <div className="pt-4 border-t border-border space-y-3">
                <div>
                  <Label className="text-foreground font-bold text-xs">Status</Label>
                  <Select value={selected.employer_status} onValueChange={(v) => updateInquiry.mutate({ id: selected.id, updates: { employer_status: v } })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {EMPLOYER_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {bookingLink && (
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={bookingLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" /> Open Booking Link
                    </a>
                  </Button>
                )}

                <div>
                  <Label className="text-foreground font-bold text-xs">Notes</Label>
                  <Textarea
                    className="mt-1"
                    rows={3}
                    defaultValue={selected.message || ""}
                    placeholder="Internal notes…"
                    onBlur={(e) => {
                      if (e.target.value !== (selected.message || "")) {
                        updateInquiry.mutate({ id: selected.id, updates: { message: e.target.value } });
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
