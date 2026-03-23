import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useCandidateProfile() {
  const { user } = useAuth();

  const profileQuery = useQuery({
    queryKey: ["candidate_profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      // First try by user_id
      let { data, error } = await supabase
        .from("candidates")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (!data && user?.email) {
        // Try by email and link
        const { data: byEmail } = await supabase
          .from("candidates")
          .select("*")
          .eq("email", user.email)
          .is("user_id", null)
          .maybeSingle();

        if (byEmail) {
          await supabase
            .from("candidates")
            .update({ user_id: user!.id })
            .eq("id", byEmail.id);

          return byEmail;
        }
      }

      if (error) throw error;
      return data;
    },
  });

  return profileQuery;
}

export function useCandidateDocuments() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["candidate_documents", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidate_documents")
        .select("*")
        .eq("user_id", user!.id)
        .order("uploaded_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useUploadDocument() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, candidateId, fileType }: { file: File; candidateId: string; fileType: string }) => {
      const filePath = `${user!.id}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("candidate-documents")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from("candidate_documents")
        .insert({
          candidate_id: candidateId,
          user_id: user!.id,
          file_name: file.name,
          file_path: filePath,
          file_type: fileType,
          file_size_bytes: file.size,
        });
      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidate_documents", user?.id] });
    },
  });
}

export function useUpdateCandidateProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<{
        full_name: string;
        city_country: string;
        whatsapp_number: string;
        specialty: "ICU" | "ER" | "Med-Surg" | "OR" | "Pediatrics" | "Geriatric" | "Mental Health" | "Community Health" | "Other";
        availability: "0-3 months" | "3-6 months" | "6-12 months";
        target_countries: string[];
      }>;
    }) => {
      const { error } = await supabase
        .from("candidates")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidate_profile", user?.id] });
    },
  });
}

export function useDeleteDocument() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, filePath }: { id: string; filePath: string }) => {
      await supabase.storage.from("candidate-documents").remove([filePath]);
      const { error } = await supabase.from("candidate_documents").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidate_documents", user?.id] });
    },
  });
}
