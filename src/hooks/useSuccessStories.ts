import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SuccessStory {
  id: string;
  title: string;
  slug: string;
  nurse_name: string;
  origin_country: string;
  destination_country: string;
  specialty: string | null;
  excerpt: string;
  body: string;
  hero_image: string | null;
  is_published: boolean;
  publish_date: string;
  created_at: string;
  updated_at: string;
}

export function useSuccessStories() {
  return useQuery({
    queryKey: ["success_stories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("success_stories")
        .select("*")
        .order("publish_date", { ascending: false });
      if (error) throw error;
      return data as SuccessStory[];
    },
  });
}

export function useSuccessStoryBySlug(slug: string) {
  return useQuery({
    queryKey: ["success_stories", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("success_stories")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data as SuccessStory;
    },
    enabled: !!slug,
  });
}
