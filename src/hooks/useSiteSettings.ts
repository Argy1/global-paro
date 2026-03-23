import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  description: string | null;
  updated_at: string;
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");
      if (error) throw error;
      const map: Record<string, string> = {};
      (data as SiteSetting[]).forEach((s) => {
        map[s.key] = s.value;
      });
      return map;
    },
  });
}

export function useSetting(key: string) {
  const { data } = useSiteSettings();
  const value = data?.[key];
  const isPlaceholder = !value || value === "UPDATE_ME";
  return { value: isPlaceholder ? null : value, isPlaceholder };
}
