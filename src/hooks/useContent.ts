import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ContentItem {
  id: string;
  type: "QuickstartChapter" | "News" | "SuccessStory";
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  tags: string[];
  cover_image_url: string | null;
  published: boolean;
  publish_date: string | null;
  country_focus: string | null;
  created_at: string;
  updated_at: string;
}

export function useContent(type?: ContentItem["type"]) {
  return useQuery({
    queryKey: ["content_items", type],
    queryFn: async () => {
      let query = supabase
        .from("content_items" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (type) {
        query = query.eq("type", type);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as unknown as ContentItem[];
    },
  });
}

export function useContentBySlug(slug: string) {
  return useQuery({
    queryKey: ["content_items", "slug", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_items" as any)
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as ContentItem | null;
    },
    enabled: !!slug,
  });
}
