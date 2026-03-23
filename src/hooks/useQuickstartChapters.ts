import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface QuickstartChapter {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export function useQuickstartChapters() {
  return useQuery({
    queryKey: ["quickstart_chapters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quickstart_chapters")
        .select("*")
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data as QuickstartChapter[];
    },
  });
}

export function useQuickstartChapterBySlug(slug: string) {
  return useQuery({
    queryKey: ["quickstart_chapters", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quickstart_chapters")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data as QuickstartChapter;
    },
    enabled: !!slug,
  });
}
