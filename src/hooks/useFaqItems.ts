import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Registration" | "English" | "Licensing" | "Pathways" | "Privacy" | "Employer";
  priority: number;
  created_at: string;
  updated_at: string;
}

export function useFaqItems(category?: FaqItem["category"]) {
  return useQuery({
    queryKey: ["faq_items", category],
    queryFn: async () => {
      let query = supabase
        .from("faq_items" as any)
        .select("*")
        .order("priority", { ascending: true });
      if (category) {
        query = query.eq("category", category);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as unknown as FaqItem[];
    },
  });
}
