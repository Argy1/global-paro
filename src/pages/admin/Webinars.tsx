import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2, Plus, Edit, Trash2, Eye, EyeOff, X, Star, StarOff, Users, Download, ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Webinar {
  id: string;
  slug: string | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  topic: string | null;
  cost: string;
  schedule: string | null;
  contact_email: string | null;
  register_link: string | null;
  is_published: boolean;
  is_featured: boolean;
  learn_items: string[];
  cover_image_url: string | null;
  event_date: string | null;
  order_index: number;
  speaker_name: string | null;
  speaker_bio: string | null;
  speaker_photo_url: string | null;
  created_at: string;
  updated_at: string;
}

interface Registration {
  id: string;
  webinar_id: string;
  full_name: string;
  email: string;
  whatsapp: string;
  notes: string | null;
  registered_at: string;
}

const empty = (): Partial<Webinar> => ({
  slug: "",
  title: "",
  subtitle: "",
  description: "",
  topic: "",
  cost: "FREE",
  schedule: "",
  contact_email: "hello@globalparo.com",
  register_link: "/register",
  is_published: false,
  is_featured: false,
  learn_items: [],
  cover_image_url: "",
  event_date: "",
  order_index: 0,
  speaker_name: "",
  speaker_bio: "",
  speaker_photo_url: "",
});

// ─── CSV Export ───────────────────────────────────────────────────────────────
function exportCSV(registrations: Registration[], webinarTitle: string) {
  const headers = ["Nama Lengkap", "Email", "WhatsApp", "Tanggal Daftar", "Catatan"];
  const rows = registrations.map((r) => [
    r.full_name,
    r.email,
    r.whatsapp,
    new Date(r.registered_at).toLocaleString("id-ID"),
    r.notes || "",
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `registrasi-${webinarTitle.toLowerCase().replace(/\s+/g, "-")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Registrations view ───────────────────────────────────────────────────────
function RegistrationsView({ webinar, onBack }: { webinar: Webinar; onBack: () => void }) {
  const { data: regs, isLoading } = useQuery({
    queryKey: ["webinar_registrations", webinar.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("webinar_registrations" as any)
        .select("*")
        .eq("webinar_id", webinar.id)
        .order("registered_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Registration[];
    },
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
            <ChevronLeft className="h-4 w-4" /> Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Registrasi Webinar</h1>
            <p className="text-sm text-muted-foreground">{webinar.title}</p>
          </div>
        </div>
        {regs && regs.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => exportCSV(regs, webinar.title)}
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            Total: <span className="font-bold text-foreground">{regs?.length ?? 0}</span> pendaftar
          </div>
          <div className="bg-card rounded-xl border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  {["#", "Nama Lengkap", "Email", "WhatsApp", "Tanggal Daftar", "Catatan"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {regs?.map((r, i) => (
                  <tr key={r.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{r.full_name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <a href={`mailto:${r.email}`} className="hover:underline">{r.email}</a>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <a href={`https://wa.me/${r.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {r.whatsapp}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(r.registered_at).toLocaleString("id-ID", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                      {r.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!regs || regs.length === 0) && (
              <p className="text-center py-10 text-muted-foreground">
                Belum ada pendaftar untuk webinar ini.
              </p>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}

// ─── Editor sub-component ─────────────────────────────────────────────────────
function WebinarEditor({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: Partial<Webinar>;
  onSave: (w: Partial<Webinar>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Partial<Webinar>>(initial);
  const set = (k: keyof Webinar, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="max-w-2xl space-y-5">
      {/* Title & Subtitle */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="font-bold">Title *</Label>
          <Input value={form.title || ""} onChange={(e) => set("title", e.target.value)} placeholder="e.g. GLOBAL CAREER" />
        </div>
        <div className="space-y-1.5">
          <Label className="font-bold">Subtitle</Label>
          <Input value={form.subtitle || ""} onChange={(e) => set("subtitle", e.target.value)} placeholder="e.g. opportunity in Singapore" />
        </div>
      </div>

      {/* Slug */}
      <div className="space-y-1.5">
        <Label className="font-bold">Slug (URL) *</Label>
        <Input
          value={form.slug || ""}
          onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
          placeholder="e.g. global-career-singapore"
        />
        <p className="text-xs text-muted-foreground">
          URL publik: <span className="font-mono">/programs/webinar/{form.slug || "..."}</span>
        </p>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label className="font-bold">Description (hero text)</Label>
        <Textarea value={form.description || ""} onChange={(e) => set("description", e.target.value)} rows={2} />
      </div>

      {/* Topic */}
      <div className="space-y-1.5">
        <Label className="font-bold">Topic (shown in card)</Label>
        <Input value={form.topic || ""} onChange={(e) => set("topic", e.target.value)} placeholder="e.g. Working as a Nurse in Singapore" />
      </div>

      {/* Cost + Schedule */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="font-bold">Cost</Label>
          <Input value={form.cost || ""} onChange={(e) => set("cost", e.target.value)} placeholder="FREE" />
        </div>
        <div className="space-y-1.5">
          <Label className="font-bold">Schedule / Time Info</Label>
          <Input value={form.schedule || ""} onChange={(e) => set("schedule", e.target.value)} placeholder="e.g. Every Saturday 10:00 WIB" />
        </div>
      </div>

      {/* Event Date + Order */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="font-bold">Event Date (optional)</Label>
          <Input type="date" value={form.event_date || ""} onChange={(e) => set("event_date", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="font-bold">Order Index</Label>
          <Input type="number" value={form.order_index ?? 0} onChange={(e) => set("order_index", Number(e.target.value))} />
        </div>
      </div>

      {/* Contact + Register link */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="font-bold">Contact Email</Label>
          <Input type="email" value={form.contact_email || ""} onChange={(e) => set("contact_email", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="font-bold">Register Link (override)</Label>
          <Input value={form.register_link || ""} onChange={(e) => set("register_link", e.target.value)} placeholder="/register" />
        </div>
      </div>

      {/* Cover Image */}
      <div className="space-y-1.5">
        <Label className="font-bold">Cover Image URL (optional)</Label>
        <Input value={form.cover_image_url || ""} onChange={(e) => set("cover_image_url", e.target.value)} placeholder="https://..." />
      </div>

      {/* ── Speaker section ── */}
      <div className="border border-border rounded-xl p-5 space-y-4 bg-muted/30">
        <p className="text-sm font-bold text-foreground">👤 Pembicara (Speaker)</p>
        <div className="space-y-1.5">
          <Label className="font-bold">Nama Pembicara</Label>
          <Input value={form.speaker_name || ""} onChange={(e) => set("speaker_name", e.target.value)} placeholder="e.g. dr. Sari Wulandari, RN" />
        </div>
        <div className="space-y-1.5">
          <Label className="font-bold">Foto Pembicara (URL)</Label>
          <Input value={form.speaker_photo_url || ""} onChange={(e) => set("speaker_photo_url", e.target.value)} placeholder="https://..." />
          {form.speaker_photo_url && (
            <img src={form.speaker_photo_url} alt="preview" className="h-16 w-16 rounded-full object-cover border mt-2" />
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="font-bold">Bio Pembicara</Label>
          <Textarea value={form.speaker_bio || ""} onChange={(e) => set("speaker_bio", e.target.value)} rows={3} placeholder="Singkat tentang pembicara..." />
        </div>
      </div>

      {/* Learn Items */}
      <div className="space-y-1.5">
        <Label className="font-bold">What You'll Learn (one item per line)</Label>
        <Textarea
          rows={6}
          value={(form.learn_items || []).join("\n")}
          onChange={(e) =>
            set("learn_items", e.target.value.split("\n").map((l) => l.trim()).filter(Boolean))
          }
          placeholder={"Overview of the Singapore healthcare system\nEligibility requirements for Indonesian nurses"}
        />
        <p className="text-xs text-muted-foreground">Each line becomes one item in the grid.</p>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6 pt-1">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.is_published ?? false} onChange={(e) => set("is_published", e.target.checked)} className="w-4 h-4" />
          <span className="font-medium">Published</span>
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.is_featured ?? false} onChange={(e) => set("is_featured", e.target.checked)} className="w-4 h-4" />
          <span className="font-medium">Featured (shown first)</span>
        </label>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-2">
        <Button variant="cta" onClick={() => onSave(form)} disabled={saving || !form.title || !form.slug} className="gap-2">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Saving…" : "Save Webinar"}
        </Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminWebinars() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Partial<Webinar> | null>(null);
  const [viewingRegs, setViewingRegs] = useState<Webinar | null>(null);

  const { data: webinars, isLoading } = useQuery({
    queryKey: ["admin_webinars"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("webinars" as any)
        .select("*")
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data as unknown as Webinar[];
    },
  });

  // Fetch registration counts for all webinars
  const { data: regCounts } = useQuery({
    queryKey: ["webinar_reg_counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("webinar_registrations" as any)
        .select("webinar_id");
      if (error) throw error;
      const counts: Record<string, number> = {};
      (data as any[]).forEach((r) => {
        counts[r.webinar_id] = (counts[r.webinar_id] || 0) + 1;
      });
      return counts;
    },
  });

  const upsert = useMutation({
    mutationFn: async (w: Partial<Webinar>) => {
      const payload = {
        slug: w.slug || null,
        title: w.title,
        subtitle: w.subtitle || null,
        description: w.description || null,
        topic: w.topic || null,
        cost: w.cost || "FREE",
        schedule: w.schedule || null,
        contact_email: w.contact_email || null,
        register_link: w.register_link || null,
        is_published: w.is_published ?? false,
        is_featured: w.is_featured ?? false,
        learn_items: w.learn_items || [],
        cover_image_url: w.cover_image_url || null,
        event_date: w.event_date || null,
        order_index: w.order_index ?? 0,
        speaker_name: w.speaker_name || null,
        speaker_bio: w.speaker_bio || null,
        speaker_photo_url: w.speaker_photo_url || null,
      };
      if (w.id) {
        const { error } = await supabase.from("webinars" as any).update(payload).eq("id", w.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("webinars" as any).insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_webinars"] });
      queryClient.invalidateQueries({ queryKey: ["webinars"] });
      setEditing(null);
      toast({ title: "Webinar saved ✓" });
    },
    onError: (e: any) =>
      toast({ title: "Save failed", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("webinars" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_webinars"] });
      queryClient.invalidateQueries({ queryKey: ["webinars"] });
      toast({ title: "Webinar deleted" });
    },
  });

  const toggleField = (w: Webinar, field: "is_published" | "is_featured") =>
    upsert.mutate({ ...w, [field]: !w[field] });

  // ── Registrations view ──
  if (viewingRegs) {
    return <RegistrationsView webinar={viewingRegs} onBack={() => setViewingRegs(null)} />;
  }

  // ── Editor view ──
  if (editing) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-foreground">
            {editing.id ? "Edit Webinar" : "New Webinar"}
          </h1>
          <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <WebinarEditor
          initial={editing}
          onSave={(w) => upsert.mutate(w)}
          onCancel={() => setEditing(null)}
          saving={upsert.isPending}
        />
      </AdminLayout>
    );
  }

  // ── List view ──
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Webinars</h1>
        <Button variant="cta" size="sm" onClick={() => setEditing(empty())} className="gap-1">
          <Plus className="h-4 w-4" /> New Webinar
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                {["Title", "Topic", "Cost", "Date", "Pendaftar", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {webinars?.map((w) => (
                <tr key={w.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{w.title}</div>
                    {w.subtitle && (
                      <div className="text-xs text-muted-foreground">{w.subtitle}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                    {w.topic || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-accent">{w.cost}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {w.event_date ? new Date(w.event_date).toLocaleDateString("id-ID") : w.schedule || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setViewingRegs(w)}
                      className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                    >
                      <Users className="h-3.5 w-3.5" />
                      {regCounts?.[w.id] ?? 0}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleField(w, "is_published")}
                        title={w.is_published ? "Unpublish" : "Publish"}
                        className="h-7 w-7 p-0"
                      >
                        {w.is_published
                          ? <Eye className="h-4 w-4 text-accent" />
                          : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleField(w, "is_featured")}
                        title={w.is_featured ? "Unfeature" : "Feature"}
                        className="h-7 w-7 p-0"
                      >
                        {w.is_featured
                          ? <Star className="h-4 w-4 text-amber-400" />
                          : <StarOff className="h-4 w-4 text-muted-foreground" />}
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setEditing(w)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => {
                          if (confirm(`Delete "${w.title}"?`)) remove.mutate(w.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!webinars?.length && (
            <p className="text-center py-10 text-muted-foreground">
              No webinars yet. Click <strong>New Webinar</strong> to create one.
            </p>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
