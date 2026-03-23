import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ChatMessageInsert {
  visitor_name: string;
  visitor_email?: string;
  visitor_phone?: string;
  message: string;
}

export function useSubmitChatMessage() {
  return useMutation({
    mutationFn: async (msg: ChatMessageInsert) => {
      const { data, error } = await supabase
        .from("chat_messages")
        .insert(msg)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  });
}
