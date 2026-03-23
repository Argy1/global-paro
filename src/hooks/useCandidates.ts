import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CandidateInsert {
  full_name: string;
  date_of_birth?: string;
  graduation_year?: number;
  university?: string;
  str_active_number?: string;
  english_capability?: "Basic" | "Intermediate" | "Fluent";
  email: string;
  email_verified?: boolean;
  whatsapp_number: string;
  whatsapp_verified?: boolean;
  motivations: string[];
  motivation_story?: string;
  challenges: string[];
  challenge_story?: string;
  help_needed: string[];
  consent_contact: boolean;
  consent_privacy: boolean;
  journey_stage?: string;
  device_type?: string;
}

export function useSubmitCandidate() {
  return useMutation({
    mutationFn: async (candidate: CandidateInsert) => {
      const { data, error } = await supabase
        .from("candidates")
        .insert(candidate as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export const useCreateCandidate = useSubmitCandidate;
