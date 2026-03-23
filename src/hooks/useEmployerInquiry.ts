import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface EmployerInquiryInsert {
  institution_name: string;
  institutional_email: string;
  title: string;
  contact_mobile: string;
  workforce_needs: string;
  preferred_timeline?: string;
}

export function useSubmitEmployerInquiry() {
  return useMutation({
    mutationFn: async (inquiry: EmployerInquiryInsert) => {
      const { data, error } = await supabase
        .from("employer_inquiries")
        .insert(inquiry)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  });
}
