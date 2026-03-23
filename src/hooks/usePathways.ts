import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Pathway = Tables<"pathways">;

export function usePathways() {
  return useQuery({
    queryKey: ["pathways"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pathways")
        .select("*")
        .order("order_index", { ascending: true });
      
      if (error) throw error;
      return data as Pathway[];
    },
  });
}

export function usePathway(slug: string) {
  return useQuery({
    queryKey: ["pathway", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pathways")
        .select("*")
        .eq("slug", slug)
        .single();
      
      if (error) throw error;
      return data as Pathway;
    },
    enabled: !!slug,
  });
}
