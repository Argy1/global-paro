import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin_site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").order("key");
      if (error) throw error;
      return data;
    },
  });

  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {};
      settings.forEach((s: any) => { map[s.key] = s.value; });
      setValues(map);
    }
  }, [settings]);

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { error } = await supabase.from("site_settings").update({ value }).eq("key", key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_site_settings"] });
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
      toast({ title: "Setting updated" });
    },
    onError: () => toast({ title: "Failed to update", variant: "destructive" }),
  });

  const updateMeCount = settings?.filter((s: any) => s.value === "UPDATE_ME").length || 0;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-extrabold text-foreground mb-2">Site Settings</h1>

      {updateMeCount > 0 && (
        <div className="flex items-center gap-2 bg-cta/10 text-cta border border-cta/30 rounded-lg p-3 mb-6">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">
            {updateMeCount} setting{updateMeCount > 1 ? "s" : ""} still set to <code className="font-mono bg-cta/10 px-1 rounded">UPDATE_ME</code>. Please update them below.
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="max-w-xl space-y-6">
          {settings?.map((s: any) => {
            const isPlaceholder = s.value === "UPDATE_ME" || values[s.key] === "UPDATE_ME";
            return (
              <div key={s.key} className={`bg-card rounded-xl p-6 border ${isPlaceholder ? "border-cta/50 ring-1 ring-cta/20" : "border-border"}`}>
                <div className="flex items-center gap-2">
                  {isPlaceholder && <AlertTriangle className="h-4 w-4 text-cta shrink-0" />}
                  <Label className="text-foreground font-bold">{s.key.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}</Label>
                </div>
                {s.description && <p className="text-xs text-muted-foreground mb-2">{s.description}</p>}
                {isPlaceholder && <p className="text-xs text-cta mb-2 font-medium">⚠ This field needs to be configured</p>}
                <div className="flex gap-2 mt-2">
                  <Input
                    value={values[s.key] || ""}
                    onChange={(e) => setValues((p) => ({ ...p, [s.key]: e.target.value }))}
                    maxLength={500}
                    className={isPlaceholder ? "border-cta/30" : ""}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateSetting.mutate({ key: s.key, value: values[s.key] || "" })}
                    disabled={updateSetting.isPending}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
