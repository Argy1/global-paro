import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type WhatsAppGroup = Tables<"whatsapp_groups">;

export function useWhatsAppGroups() {
  return useQuery({
    queryKey: ["whatsapp_groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("whatsapp_groups")
        .select("*")
        .order("order_index", { ascending: true });
      
      if (error) throw error;
      return data as WhatsAppGroup[];
    },
  });
}
